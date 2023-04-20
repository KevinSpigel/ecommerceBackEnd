const args = require("../config/args.config");

const { devLogger, prodLogger } = require("../logger/logger");

const environment = args.mode;

const logger = (environment !== "production") ? devLogger : prodLogger;


const addLogger = (req, res, next) => {
  req.logger = logger;
  logger.info(
    `[${req.method}]=> ${req.url} - ${new Date().toLocaleDateString()}`
  );
  next();
};

module.exports = addLogger;
