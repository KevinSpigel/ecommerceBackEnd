const OrdersController = require("../../controllers/orders.controller");

const { BaseRouter } = require("../base.router");

class OrdersRoutes extends BaseRouter {
  init() {
    this.get("/", ["admin"], OrdersController.getOrders);
    this.get("/:oid", ["user", "admin"], OrdersController.getOrderById);
    this.post("/", ["user", "admin"], OrdersController.createOrder);
    this.put("/", ["admin"], OrdersController.resolveOrder);
  }
}

module.exports = new OrdersRoutes();
