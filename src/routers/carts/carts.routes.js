const CartsController = require("../../controllers/carts.controller");
const {
  cartValidatorMiddleware,
} = require("../../middlewares/cartValidator.middleware");
const { BaseRouter } = require("../base.router");

class CartsRouter extends BaseRouter {
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
      "/:cid/products/:pid",
      ["user", "admin"],
      CartsController.addProductToCart
    );
    this.put(
      "/:cid",
      ["user", "admin"],
      CartsController.updatePropertiesProducts
    );
    this.put(
      "/:cid/products/:pid",
      ["user", "admin"],
      CartsController.updateCartProduct
    );
    this.delete(
      "/:cid/products/:pid",
      ["user", "admin"],
      CartsController.deleteProductFromCart
    );
    this.delete("/:cid", ["user", "admin"], CartsController.deleteCart);
  }
}

module.exports = new CartsRouter();
