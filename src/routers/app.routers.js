const { Router } = require("express");
const productsRoutes = require("./products/products.routes");
const cartsRoutes = require("./carts/carts.routes");
const sessionsRouter = require("./sessions/sessions.routes");
const { errorMiddleware } = require("../middlewares/error.middleware");

const router = Router();

router.use("/products", productsRoutes.getRouter());
router.use("/carts", cartsRoutes.getRouter());
router.use("/sessions", sessionsRouter);

router.use(errorMiddleware);

module.exports = router;
