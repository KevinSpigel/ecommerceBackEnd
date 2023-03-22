const { MONGO_URI } = require("./env.config");

//Ways to connect to different systems

const options = {
  // FileSystem: {
  //   products: "../models/dao/fileManager/fileSystemDb/productsDataBase.json",
  //   carts: "../models/dao/fileManager/fileSystemDb/cartDataBase.json",
  // },
  mongoDb: {
    url: MONGO_URI,
  },
};

module.exports = { options };
