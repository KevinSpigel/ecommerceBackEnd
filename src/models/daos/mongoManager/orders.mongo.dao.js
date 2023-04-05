const { MongoDbConnection } = require("../../db/mongoDB/mongo.manager");
const { OrdersModel } = require("../../schemas/orders.schema");

class OrdersMongoDao {
  constructor() {
    MongoDbConnection.getInstance();
  }
  async getOrders() {
    const orders = await OrdersModel.find().lean();
    return orders;
  }

  async getOrderById(id) {
    const order = await OrdersModel.findOne({ _id: id }).lean();
    return order;
  }

  async createOrder(payload) {
    const newOrder = await OrdersModel.create(payload);
    return newOrder;
  }

  async updateOrder(id, payload) {
    const updatedOrder = await OrdersModel.updateOne({ _id: id }, {
      $set: payload
    });
    return updatedOrder;
  }
  
}

module.exports = OrdersMongoDao;