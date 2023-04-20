const { BaseRouter } = require("../base.router");
const LoggersTestController = require("../../controllers/loggersTest.controller");


class LoggersTestRoutes extends BaseRouter {
  init() {
    this.get("/", ["admin"], LoggersTestController.generateLoggersTest);
  }
}

module.exports = new LoggersTestRoutes();