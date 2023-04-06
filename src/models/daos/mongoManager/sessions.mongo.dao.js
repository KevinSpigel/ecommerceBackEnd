const { MongoDbConnection } = require("../../../db/mongoDB/mongo.manager");

class SessionsMongoDao {
  constructor() {
    MongoDbConnection.getInstance();
  }
}

module.exports = SessionsMongoDao;
