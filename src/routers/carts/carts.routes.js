const CartsController = require("../../controllers/carts.controller");
const {
  cartValidatorMiddleware,
} = require("../../middlewares/cartValidator.middleware");
const { BaseRouter } = require("../base.router");

class CartsRoutes extends BaseRouter {
  init() {
    this.get("/", ["admin"], CartsController.getCarts);
    this.get(
      "/:cid",
      ["user", "admin"],
      cartValidatorMiddleware,
      CartsController.getCartById
    );
    this.post("/", ["admin"], CartsController.addCart);
    this.post(
      "/products/:pid",
      ["user", "admin"],
      CartsController.addProductToCart
    );
    this.put(
      "/products/:pid",
      ["user", "admin"],
      CartsController.updateCartProduct
    );

    this.post("/:cid/purchase", ["user"], CartsController.purchaseCart);

    this.delete(
      "/products/:pid",
      ["user", "admin"],
      CartsController.deleteProductFromCart
    );
    this.delete("/:cid", ["admin"], CartsController.deleteCart);
  }
}

module.exports = new CartsRoutes();
