const { NRAF_ROUTER } = require("./constants");

const EXT_MIME_TYPE_HEADER_MAP = {
  ".css": "text/css",
  ".png": "image/png",
  ".ico": "image/vnd.microsoft.icon",
  ".js": "application/javascript; charset=utf-8",
};

function typeBasedParser(type, data) {
  if (type === "application/x-www-form-urlencoded") {
    const urlSearchParam = new URLSearchParams(data);
    return Object.fromEntries(urlSearchParam.entries());
  } else if (
    type === "application/json;charset=utf-8" ||
    type === "application/json"
  ) {
    return JSON.parse(data);
  } else {
    return null;
  }
}

function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "")
    : baseURL;
}

function get(endpoint, fxn) {
  const routeObj = {
    url: endpoint,
    method: "GET",
    scoped: this.__isScoped || false,
    scopeKey: this.__scopeKey || null,
    fn: (req, res) => {
      fxn(req, res);
    },
  };

  this.__routers.push(routeObj);
}

function post(endpoint, fxn) {
  const routeObj = {
    url: endpoint,
    method: "POST",
    scoped: this.__isScoped || false,
    scopeKey: this.__scopeKey || null,
    fn: (req, res) => {
      fxn(req, res);
    },
  };

  this.__routers.push(routeObj);
}

function use(baseEndpoint, router) {
  const isRouterInjections = router.getType() === NRAF_ROUTER;
  if (isRouterInjections) {
    const routes = router.getRoutes();
    if (baseEndpoint && routes) {
      routes.forEach(({ url, method, fn }) => {
        if (method === "GET") {
          this.get(combineURLs(baseEndpoint, url), fn);
        } else if (method === "POST") {
          this.post(combineURLs(baseEndpoint, url), fn);
        } else {
          console.assert(false, "UNSUPPORTED METHOD");
        }
      });
    } else {
      console.assert(
        router?.length !== 0,
        `Unexpected routes collection ${router}`
      );
    }
  }
}

module.exports = {
  typeBasedParser,
  EXT_MIME_TYPE_HEADER_MAP,
  combineURLs,
  get,
  post,
  use,
};
