const { MONGO_URI } = require("./env.config");

//Ways to connect to different systems

const DB_CONFIG = {
  // fileSystem: {
  //   products: "../models/daos/db/files/productsDB.json",
  //   carts: "../models/daos/db/files/cartsDB.json",
  //   chats:"../models/daos/db/files/chatsDB.json",
  //   users:"../models/daos/db/files/usersDB.json",
  //   orders:"../models/daos/db/files/ordersDB.json",
  //   sessions:"../models/daos/db/files/sessionsDB.json",
  // },
  mongoDb: {
    uri: MONGO_URI,
  },
};

module.exports = { DB_CONFIG };
