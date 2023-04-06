const mongoose = require("mongoose");
const { DB_CONFIG } = require("../../config/dbConfig");

//connect with the database with SINGLETON METHOD

class MongoDbConnection {
  static #instance;
  constructor() {
    mongoose.set("strictQuery", false);

    mongoose
      .connect(DB_CONFIG.mongoDb.uri)
      .then(() => {
        console.log("Database connection successful");
      })
      .catch((error) => {
        console.log("Database connection error");
        throw error;
      });
  }

  static getInstance() {
    if (!this.#instance) {
      this.#instance = new MongoDbConnection();
    }
    return this.#instance;
  }
}

module.exports = {
  MongoDbConnection,
};
