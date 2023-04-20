const { apiSuccessResponse, HTTP_STATUS } = require("../utils/api.utils");

class LoggersTestController {
  static async generateLoggersTest(req, res, next) {
    try {
      req.logger.fatal("test fatal");
      req.logger.error("test error");
      req.logger.warning("test warning");
      req.logger.info("test info");
      req.logger.http("test http");
      req.logger.debug("test debug");

      const result = "Logger Tests";
      const response = apiSuccessResponse(result);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = LoggersTestController;
