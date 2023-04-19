const { devLogger, prodlogger } = require("../logger/logger");

// if (process.env.NODE_ENV !== "production") {
 
// }

const addLogger = (req, res, next) => {
  req.logger = prodlogger; //falta logica segun entorno de desarrollo
  prodlogger.info(
    `[${req.method}]=> ${req.url} - ${new Date().toLocaleDateString()}`
  );
  next();
};

module.exports = addLogger;
