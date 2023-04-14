const { BaseRouter } = require("../base.router");
const MocksProductsController = require("../../controllers/mocksproducts.controller");


class MocksProductsRoutes extends BaseRouter {
  init() {
    this.get("/", ["admin"], MocksProductsController.generateMockProducts);
  }
}

module.exports = new MocksProductsRoutes();
