const env = require("./config/env.config");
const express = require("express");
const path = require("path");
const handlebars = require("express-handlebars");
require("./config/db.config");
const socketServer = require("./socket/socket.controller");

const cookieParser = require("cookie-parser");
const passport = require("passport");

const { logger } = require("./logger/logger");
const addLogger = require("./middlewares/logger.middleware");

const viewsRoutes = require("./routers/views/views.routes");
const apiRoutes = require("./routers/app.routers");

const app = express();
const PORT = env.PORT;

// Listen
const httpServer = app.listen(PORT, () => {
  logger.info(
    `Process ID [${process.pid}] - The Server is up and running on port ${
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

// Template Engine
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static(path.resolve(__dirname, "./public")));
app.use(cookieParser());
app.use(passport.initialize());
app.use(addLogger);

// Routes
app.use(viewsRoutes);
app.use("/api", apiRoutes);

// Add error handling for uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error(`Uncaught exception: ${error.message}`);
  process.exit(1);
});

// Add error handling for unhandled promise rejections
process.on("unhandledRejection", (error) => {
  logger.error(`Unhandled promise rejection: ${error.message}`);
  process.exit(1);
});
