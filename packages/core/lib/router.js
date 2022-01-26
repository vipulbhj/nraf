const { NRAF_ROUTER } = require("./constants");
const { get: addGETEnpoint, post: addPOSTEndpoint } = require("./helper");

class NRAFRouter {
  constructor() {
    this.__routers = [];
    this.__TYPE = NRAF_ROUTER;

    this.get = addGETEnpoint.bind(this);
    this.post = addPOSTEndpoint.bind(this);
  }

  getType() {
    return this.__TYPE;
  }

  getRoutes() {
    return this.__routers;
  }
}

module.exports = NRAFRouter;
