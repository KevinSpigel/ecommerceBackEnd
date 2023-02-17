const { Router } = require("express");
const productsRoutes = require("./products/products.routes");
const cartsRoutes = require("./cart/carts.routes");
const sessionsRouter = require("./sessions/session.routes");

const router = Router();

router.use("/products", productsRoutes);
router.use("/carts", cartsRoutes);
router.use("/sessions", sessionsRouter);


module.exports = router;
