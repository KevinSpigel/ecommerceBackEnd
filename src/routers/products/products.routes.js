const { BaseRouter } = require("../base.router");
const uploader = require("../../utils/multer.utils");
const ProductsController = require("../../controllers/products.controller");

class ProductsRoutes extends BaseRouter {
  init() {
    this.get("/", ["user", "admin"], ProductsController.getProducts);
    this.get("/:pid", ["user", "admin"], ProductsController.getProductById);
    this.post(
      "/",
      ["admin"],
      uploader.single("thumbnail"),
      ProductsController.addProduct
    );
    this.put("/:pid", ["admin"], ProductsController.updateProduct);
    this.delete("/:pid", ["admin"], ProductsController.deleteProduct);
  }
}

module.exports = new ProductsRoutes();
