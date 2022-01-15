"use strict";

const fs = require("fs");
const url = require("url");
const http = require("http");
const path = require("path");
const NTE = require("@nraf/nte");
const { promisify } = require("util");
const { typeBasedParser, EXT_MIME_TYPE_HEADER_MAP } = require("./helper");

const readFile = promisify(fs.readFile);

class App {
  constructor() {
    this.__publicResPath = null;
    this.__templateResPath = null;

    this.__routers = [];
    this.__middlewares = [];
    this.__templateCache = {};
    this.__SET_TYPES = {
      VIEWS: "views",
      PUBLIC: "public",
    };

    this.app = http.createServer((req, res) => {
      const URL = url.parse(req.url, true);

      req.url = URL.pathname;
      req.query = URL.query;

      res.setHeader("Content-Type", "text/html");
      res.setHeader("Client", "Not-Really-A-Framework");

      res.send = res.write;

      res.setStatus = (code) => {
        res.statusCode = code;
      };

      res.json = (obj) => {
        res.setHeader("content-type", "application/json; charset=utf-8");
        res.write(JSON.stringify(obj));
      };

      res.redirect = (location) => {
        if (!location) {
          throw new Error("Error: location parameter not supplied");
        }
        res.setStatus(302);
        res.setHeader("Location", location);
        res.end();
      };

      res.render = (name, renderContext) => {
        const includePartial = (filePath) => {
          const partialAbsPath = path.join(
            this.__templateResPath,
            `${filePath}.nraf`
          );

          // Check if file exists.
          if (!fs.existsSync(partialAbsPath)) {
            throw new Error(`Partial not found. ${partialAbsPath}`);
          }

          const cachedRenderer = this.__templateCache[partialAbsPath];
          if (process.env.NODE_ENV === "PRODUCTION" && cachedRenderer) {
            const html = cachedRenderer(renderContext);
            return html;
          } else {
            const data = fs.readFileSync(partialAbsPath, {
              flag: "r",
              encoding: "utf8",
            });
            const template = new NTE(data);
            template.compile();
            this.__templateCache[partialAbsPath] = template.getRenderer();
            const html = template.render(renderContext);
            return html;
          }
        };

        const absTemplatePath = path.join(
          this.__templateResPath,
          `${name}.nraf`
        );

        // Check if file exists.
        if (!fs.existsSync(absTemplatePath)) {
          res.setStatus(404);
          res.setHeader("Content-Type", "text/html");
          res.send("<h1>Error: 404. Page Not Found</h1>");
          res.end();
        }

        const cachedRenderer = this.__templateCache[absTemplatePath];
        if (process.env.NODE_ENV === "PRODUCTION" && cachedRenderer) {
          const html = cachedRenderer(renderContext);
          res.send(html);
          res.end();
        } else {
          readFile(absTemplatePath, { encoding: "utf8", flag: "r" })
            .then((data) => {
              const template = new NTE(data);
              template.compile();
              this.__templateCache[absTemplatePath] = template.getRenderer();
              const html = template.render({
                ...renderContext,
                include: includePartial,
              });
              res.send(html);
              res.end();
            })
            .catch((err) => {
              throw new Error(err);
            });
        }
      };

      let dataFromReq = null;
      req.on("data", (chunk) => {
        if (!dataFromReq) {
          dataFromReq = chunk.toString();
          return;
        }
        dataFromReq += chunk.toString();
      });

      this.__middlewares.forEach((callback) => {
        callback(req, res, function () {});
      });

      req.on("end", () => {
        req.body = typeBasedParser(req.headers["content-type"], dataFromReq);
        let m = this.match(this.__routers, req);
        m(req, res);
      });
    });
  }

  match(appRoutes, incomingRequest) {
    const incomingRequestUrl = incomingRequest.url;
    const incomingRequestMethod = incomingRequest.method;

    for (let route of appRoutes) {
      const routeParams = {};
      const routeTemplate = route["url"];
      const routeSignature = routeTemplate
        .split("/")
        .map((subPathname) => {
          if (subPathname && subPathname.startsWith(":")) {
            routeParams[subPathname.substring(1)] = null;
            return "(.+)";
          } else {
            return subPathname;
          }
        })
        .join("/");

      const routeSignatureRegex = new RegExp(`^${routeSignature}$`, "g");

      const isRoutePathnameMatch = routeSignatureRegex.exec(incomingRequestUrl);

      if (
        isRoutePathnameMatch &&
        route["method"] === incomingRequestMethod.toUpperCase()
      ) {
        let i = 1;
        for (const routeParam in routeParams) {
          routeParams[routeParam] = isRoutePathnameMatch[i++];
        }
        incomingRequest.params = routeParams;

        return route["fn"];
      }
    }

    return this.serverPublicAssets.bind(this);
  }

  listen(PORT, callback = () => {}) {
    this.app.listen(PORT, () => {
      console.log(`#########################\n`);
      console.log("Thank you for using NRAF");
      console.log("#########################\n");
      callback();
    });
  }

  get(endpoint, fnx) {
    const routeObj = {
      url: endpoint,
      fn: (req, res) => {
        fnx(req, res);
      },
      method: "GET",
    };
    this.__routers.push(routeObj);
  }

  post(endpoint, fxn) {
    const routeObj = {
      url: endpoint,
      fn: (req, res) => {
        fxn(req, res);
      },
      method: "POST",
    };
    this.__routers.push(routeObj);
  }

  set(setType, value) {
    switch (setType) {
      case this.__SET_TYPES.VIEWS:
        this.__templateResPath = value;
        break;
      case this.__SET_TYPES.PUBLIC:
        this.__publicResPath = value;
        break;
      default:
        console.error("Unsupported type", setType);
    }
  }

  use(callback) {
    this.__middlewares.push(callback);
  }

  serverPublicAssets(req, res) {
    if (!this.__publicResPath) {
      console.error(`
WARNING:      
*****
Got a request for "${req.url}" asset, but can't serve public assets, as public asset path was never set.

If you are making a website, you should check your applicaion entrypoint, and call call "app.set("public", <path>);" to fix this issue.

If you are making REST API, and testing them via the browser, you can ignore this, as this might be a request brower automatically sent to fetch resource like "favicon icons", etc.

Refer to the documentation, to learn more.
*****      
      `);

      res.setStatus(401);
      res.send("Not Found");
      return res.end();
    }

    const absolutePath = path.join(this.__publicResPath, req.url);
    if (fs.existsSync(absolutePath)) {
      const ext = path.extname(absolutePath);
      const header = EXT_MIME_TYPE_HEADER_MAP[ext];
      if (header) {
        res.setHeader("Content-Type", header);
      }
      readFile(absolutePath, { flag: "r" })
        .then((data) => {
          res.send(data);
          res.end();
        })
        .catch((err) => {
          throw err;
        });
    } else {
      res.setStatus(401);
      res.send("Not Found");
      res.end();
    }
  }
}

module.exports = App;
