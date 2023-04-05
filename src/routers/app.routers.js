const { Router } = require("express");
const { errorMiddleware } = require("../middlewares/error.middleware");
const productsRoutes = require("./products/products.routes");
const cartsRoutes = require("./carts/carts.routes");
const sessionsRoutes = require("./sessions/sessions.routes");
const usersRoutes = require("./users/users.routes");
const ordersRoutes = require("./orders/orders.routes");

const router = Router();

router.use("/products", productsRoutes.getRouter());
router.use("/carts", cartsRoutes.getRouter());
router.use("/sessions", sessionsRoutes);
router.use("/users", usersRoutes.getRouter());
router.use("/orders", ordersRoutes.getRouter());

router.use(errorMiddleware);

module.exports = router;
