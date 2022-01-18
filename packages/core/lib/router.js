const { NRAF_ROUTER } = require("./constants");

class NRAFRouter {
  constructor() {
    this.__routes = [];
    this.__TYPE = NRAF_ROUTER;
  }

  get(endpoint, fxn) {
    const routeObj = {
      url: endpoint,
      fn: (req, res) => {
        fxn(req, res);
      },
      method: "GET",
    };

    this.__routes.push(routeObj);
  }

  post(endpoint, fxn) {
    const routeObj = {
      url: endpoint,
      fn: (req, res) => {
        fxn(req, res);
      },
      method: "POST",
    };
    this.__routes.push(routeObj);
  }

  getType() {
    return this.__TYPE;
  }

  getRoutes() {
    return this.__routes;
  }
}

module.exports = NRAFRouter;
