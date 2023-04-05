const { PERSISTENCE } = require("../../config/env.config");

let productsDao;

let cartsDao;

let chatsDao;

let ordersDao;

let usersDao;

let sessionsDao;

console.log(`Using "${PERSISTENCE}" as persistence`);

switch (PERSISTENCE) {
  case "FILES": {
    const ProductsFileSystemDao = require("./fileSystem/products.fileSystem.dao");
    const CartsFileSystemDao = require("./fileSystem/carts.fileSystem.dao");
    const ChatsFileSystemDao = require("./fileSystem/chats.fileSystem.dao");
    const OrdersFileSystemDao = require("./fileSystem/orders.fileSystem.dao");
    const UsersFileSystemDao = require("./fileSystem/users.fileSystem.dao");
    const SessionsFileSystemDao = require("./fileSystem/sessions.fileSystem.dao");

    productsDao = new ProductsFileSystemDao();
    cartsDao = new CartsFileSystemDao();
    chatsDao = new ChatsFileSystemDao();
    ordersDao = new OrdersFileSystemDao();
    usersDao = new UsersFileSystemDao();
    sessionsDao = new SessionsFileSystemDao();

    break;
  }

  case "MONGO": {
    const ProductsMongoDao = require("./mongoManager/products.mongo.dao");
    const CartsMongoDao = require("./mongoManager/carts.mongo.dao");
    const ChatsMongoDao = require("./mongoManager/chats.mongo.dao");
    const OrdersMongoDao = require("./mongoManager/orders.mongo.dao");
    const UsersMongoDao = require("./mongoManager/users.mongo.dao");
    const SessionsMongoDao = require("./mongoManager/sessions.mongo.dao");

    productsDao = new ProductsMongoDao();
    cartsDao = new CartsMongoDao();
    chatsDao = new ChatsMongoDao();
    ordersDao = new OrdersMongoDao();
    usersDao = new UsersMongoDao();
    sessionsDao = new SessionsMongoDao();

    break;
  }

  default: {
    throw new Error("Please provide a valid persistence method");
  }
}

const getDAOS = () => {
  return {
    productsDao,
    cartsDao,
    chatsDao,
    ordersDao,
    usersDao,
    sessionsDao,
  };
};

module.exports = { getDAOS };
