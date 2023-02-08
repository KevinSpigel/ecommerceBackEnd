const express = require("express");
const { Server } = require("socket.io");
const handlebars = require("express-handlebars");
require("./config/dbConfig");

const viewsRoutes = require("./routers/views.routes");
const apiRoutes = require("./routers/app.routers");
const cookieRoutes= require("./routers/cookie.routes");

const ChatMongoManager = require("./dao/mongoManager/chatManager.mongoose");
const messages = new ChatMongoManager();

const app = express();
const PORT = process.env.PORT || 8080;

// Listen
const httpServer = app.listen(PORT, () => {
  console.log("The Server is up and running in the port", PORT);
});

// SOCKET

const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("New client connected");
  app.set("socket", socket);

  const getChats = async () => {
    const msg = await messages.getMessages();
    socket.emit("message-logs", msg);
  };

  socket.on("login", async (user) => {
    await getChats();
    socket.emit("welcome", user);
    socket.broadcast.emit("new-user", user);
  });

  socket.on("message", async (data) => {
    await messages.addMessages(data);
    const msg = await messages.getMessages();
    io.emit("message-logs", msg);
  });
});


// Template Engine
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static(__dirname + "/../public"));

// Routes
app.use(viewsRoutes);
app.use("/api", apiRoutes);
app.use("/cookie", cookieRoutes);


app.use((error, req, res, next) => {
  res.status(500).json({
    status: "error",
    error,
  });
});
