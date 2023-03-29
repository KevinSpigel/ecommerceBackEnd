const { MONGO_URI } = require("./env.config");

//Ways to connect to different systems

const DB_CONFIG = {
  // FileSystem: {
  //   products: "../models/daos/fileManager/fileSystemDb/productsDataBase.json",
  //   carts: "../models/daos/fileManager/fileSystemDb/cartDataBase.json",
  // },
  mongoDb: {
    uri: MONGO_URI,
  },
};

module.exports = { DB_CONFIG };
