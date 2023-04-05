const env = require("./config/env.config");
const express = require("express");
const path = require("path");
const handlebars = require("express-handlebars");
require("./config/dbConfig");
const socketServer = require("./socket/socket.controller");

const cookieParser = require("cookie-parser");
const passport = require("passport");

const viewsRoutes = require("./routers/views.routes");
const apiRoutes = require("./routers/app.routers");

const app = express();
const PORT = env.PORT;

// Listen
const httpServer = app.listen(PORT, () => {
  console.log(
    `The Server is up and running on port ${httpServer.address().port}`
  );
});

// Server listen connection error

httpServer.on("error", (error) => {
  console.log(
    `There was an error tryg to start the server on ${
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

// Routes
app.use(viewsRoutes);
app.use("/api", apiRoutes);
