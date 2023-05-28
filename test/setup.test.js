const { DB_CONFIG } = require("../src/config/db.config");
const { SESSION_KEY } = require("../src/config/env.config");
const mongoose = require("mongoose");
const { CartsModel } = require("../src/models/schemas/carts.schema");
const { ProductsModel } = require("../src/models/schemas/products.schema");
const { UsersModel } = require("../src/models/schemas/users.schema");


before(async () => {
  mongoose.set("strictQuery", true);
  mongoose.connect(DB_CONFIG.mongoDb.uri);
});

after(async () => {
  mongoose.connection.close();
});

const dropCarts = async () => {
  await CartsModel.collection.drop();
};

const dropProducts = async () => {
  await ProductsModel.collection.drop();
};

const dropUsers = async () => {
  await UsersModel.collection.drop();
};

const dropSessions = async (res) => {
  await res.clearCookie(SESSION_KEY);
};

module.exports = { dropCarts, dropProducts, dropUsers, dropSessions };
