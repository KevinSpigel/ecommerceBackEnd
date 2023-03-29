const { PERSISTENCE } = require("../../config/env.config");

let productsDao;

let cartsDao;

let chatsDao;

console.log(`Using "${PERSISTENCE}" as persistence`);

switch (PERSISTENCE) {
  case "FILES": {
    const ProductsFileSystemDao = require("./fileSystem/products.fileSystem.dao");
    const CartsFileSystemDao = require("./fileSystem/carts.fileSystem.dao");

    productsDao = new ProductsFileSystemDao();
    cartsDao = new CartsFileSystemDao();

    break;
  }

  case "MONGO": {
    const ProductsMongoDao = require("./mongoManager/products.mongo.dao");
    const CartsMongoDao = require("./mongoManager/carts.mongo.dao");
    const ChatsMongoDao = require("./mongoManager/chats.mongo.dao");

    productsDao = new ProductsMongoDao();
    cartsDao = new CartsMongoDao();
    chatsDao = new ChatsMongoDao();

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
  };
};

module.exports = { getDAOS };
