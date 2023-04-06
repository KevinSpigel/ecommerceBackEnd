const { Router } = require("express");
const { errorMiddleware } = require("../middlewares/error.middleware");
const productsRoutes = require("./products/products.routes");
const cartsRoutes = require("./carts/carts.routes");
const sessionsRoutes = require("./sessions/sessions.routes");

const router = Router();

router.use("/products", productsRoutes.getRouter());
router.use("/carts", cartsRoutes.getRouter());
router.use("/sessions", sessionsRoutes);

router.use(errorMiddleware);

module.exports = router;
