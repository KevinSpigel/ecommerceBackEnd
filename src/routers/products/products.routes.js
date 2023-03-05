const { Router } = require("express");
const uploader = require("../../utils/multer.utils");
const ProductsController = require("../../controllers/products.controller");

const router = Router();

router.get("/", ProductsController.getProducts);
router.get("/:pid", ProductsController.getProductById);
router.post("/", uploader.single("thumbnail"), ProductsController.addProduct);
router.put("/:pid", ProductsController.updateProduct);
router.delete("/:pid", ProductsController.deleteProduct);

module.exports = router;

