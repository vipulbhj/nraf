"use strict";

const url = require("url");
const http = require("http");
const path = require("path");
const { typeBasedParser } = require("./helper");

class App {
  constructor() {
    this.routers = [];
    this.middlewares = [];
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
      };

      let dataFromReq = null;
      req.on("data", (chunk) => {
        if (!dataFromReq) {
          dataFromReq = chunk.toString();
          return;
        }
        dataFromReq += chunk.toString();
      });

      this.middlewares.forEach((callback) => {
        callback(req, res, function () {});
      });

      req.on("end", () => {
        req.body = typeBasedParser(req.headers["content-type"], dataFromReq);
        let m = this.match(this.routers, req);
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

      const routeSignatureRegex = new RegExp(routeSignature, "g");

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

    return (req, res) => {
      res.setStatus(401);
      res.send("Not Found");
      res.end();
    };
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
    this.routers.push(routeObj);
  }

  post(endpoint, fxn) {
    const routeObj = {
      url: endpoint,
      fn: (req, res) => {
        fxn(req, res);
      },
      method: "POST",
    };
    this.routers.push(routeObj);
  }

  use(callback) {
    this.middlewares.push(callback);
  }
}

module.exports = App;
