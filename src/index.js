const env = require("./config/env.config");
const cluster = require("cluster");
const { cpus } = require("os");
const { logger } = require("./logger/logger");
const { app } = require("./server");

const PORT = env.PORT;

const socketServer = require("./socket/socket.controller");

if (cluster.isPrimary) {
  const cores = cpus().length;
  logger.info(`Number of Cores => ${cores}`);
  for (let i = 0; i < cores; i++) {
    cluster.fork();
  }
} else {
  // Listen
  const httpServer = app.listen(PORT, () => {
    console.log(
      `[${process.pid}] - The Server is up and running on port ${
        httpServer.address().port
      }`
    );
  });

  // Server listen connection error
  httpServer.on("error", (error) => {
    logger.fatal(
      `There was an error trying to start the server on ${
        httpServer.address().port
      }`
    );
  });

  // Socket
  socketServer(app, httpServer);
}
