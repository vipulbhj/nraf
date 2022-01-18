"use strict";

const App = require("./app");
const NRAFRouter = require("./router");

const NRAF = function () {
  return new App();
};

NRAF.Router = () => new NRAFRouter();

module.exports = NRAF;
