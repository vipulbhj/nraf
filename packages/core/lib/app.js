"use strict";

const fs = require("fs");
const path = require("path");
const http = require("http");
const NTE = require("@nraf/nte");
const { promisify } = require("util");
const {
  typeBasedParser,
  get: addGETEnpoint,
  use: expandRouter,
  post: addPOSTEndpoint,
  EXT_MIME_TYPE_HEADER_MAP,
} = require("./helper");

const readFile = promisify(fs.readFile);

class App {
  constructor() {
    this.__publicResPath = null;
    this.__templateResPath = null;

    this.__scopes = {};
    this.__routers = [];
    this.__templateCache = {};
    this.__SET_TYPES = {
      VIEWS: "views",
      PUBLIC: "public",
    };

    this.app = http.createServer((req, res) => {
      const baseURL = req.protocol + "://" + req.headers.host + "/";
      const url = new URL(req.url, baseURL);

      req.url = url.pathname;
      req.query = Object.fromEntries(url.searchParams.entries());

      res.setHeader("Content-Type", "text/html");
      res.setHeader("Client", "Not-Really-A-Framework");

      res.setStatus = (code) => {
        res.statusCode = code;
      };

      res.send = (data) => {
        res.write(data);
        res.end();
      };

      res.json = (obj) => {
        res.setHeader("content-type", "application/json; charset=utf-8");
        res.write(JSON.stringify(obj));
        res.end();
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

      req.on("end", () => {
        // To support parsing data of modes which are not supported.
        req.originalData = dataFromReq;
        const parsedData = typeBasedParser(
          this.__publicResPath,
          req.headers["content-type"],
          dataFromReq
        );

        if (Array.isArray(parsedData)) {
          req.body = parsedData?.[0] ?? {};
          req.files = parsedData?.[1] ?? {};
        } else {
          req.body = parsedData;
        }
        let m = this.match(this.__routers, req);
        if (m instanceof Function) {
          m(req, res);
        } else if (!m.scoped) {
          m["fn"](req, res);
        } else {
          const key = m.scopeKey;
          const pipeline = this.__scopes[key];
          if (!pipeline) {
            throw new Error("Unreachable");
          }

          for (let i = 0; i < pipeline.length; ++i) {
            let obj = {
              moveToNext: false,
              err: null,
            };

            const f = pipeline[i];

            f.call(null, req, res, () => {
              obj.moveToNext = true;
            });

            if (!obj.moveToNext) return;
          }

          m["fn"](req, res);
        }
      });
    });
  }

  get(endpoint, fxn) {
    addGETEnpoint.call(this, endpoint, fxn);
  }

  post(endpoint, fxn) {
    addPOSTEndpoint.call(this, endpoint, fxn);
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

        return route;
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

  use(baseEndpoint, router) {
    expandRouter.call(this, baseEndpoint, router);
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

  scope(scopeKey, pipeline, fn) {
    if (!scopeKey) {
      throw new Error("Scope can't be created without names");
    } else if (this.__scopes[scopeKey]) {
      throw new Error("Scope with name already exists");
    }

    this.__scopes[scopeKey] = pipeline;

    const newThis = {
      ...this,
      __isScoped: true,
      __scopeKey: scopeKey,
    };

    const scoppedGET = addGETEnpoint.bind(newThis);
    const scoppedPOST = addPOSTEndpoint.bind(newThis);

    const SCOPE = {
      get: scoppedGET,
      post: scoppedPOST,
      use: expandRouter.bind({
        ...newThis,
        get: scoppedGET,
        post: scoppedPOST,
      }),
    };

    fn(SCOPE);
  }
}

module.exports = App;
