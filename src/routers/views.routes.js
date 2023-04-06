const { Router } = require("express");
const uploader = require("../utils/multer.utils");
const { passportCustom } = require("../middlewares/passportCustom.middleware");
const { authToken } = require("../middlewares/authToken.middleware");

const router = Router();

const authMiddlewares = [passportCustom("jwt"), authToken];

const { getDAOS } = require("../models/daos/daosFactory");

const { cartsDao, productsDao } = getDAOS();

//LOGIN

router.get("/", (req, res, next) => {
  const data = {
    status: true,
    title: "Login",
    style: "index.css",
  };
  try {
    res.render("login", data);
  } catch (error) {
    res.redirect("/static/html/failedRequest.html");
  }
});

//REGISTER

router.get("/register", (req, res, next) => {
  const data = {
    status: true,
    title: "Register",
    style: "index.css",
  };
  try {
    res.render("register", data);
  } catch (error) {
    res.redirect("/static/html/failedRequest.html");
  }
});

//PRODUCTS

router.get("/products", authMiddlewares, async (req, res, next) => {
  try {
    const product = await productsDao.getProducts(req.query);
    const user = req.user;
    const isAdmin = req.user.role == "admin";

    if (product.docs) {
      const data = {
        status: true,
        title: "Real Time Products",
        style: "index.css",
        list: product.docs,
        user,
        isAdmin,
      };

      res.render("realTimeProducts", data);
    } else {
      return res.status(404).render("realTimeProducts", {
        status: false,
        style: "index.css",
        data: "Empty list",
      });
    }
  } catch (error) {
    res.redirect("/static/html/failedRequest.html");
  }
});

//CART

router.get("/cart", authMiddlewares, async (req, res, next) => {
  try {
    const cid = req.user.cart;
    const cartById = await cartsDao.getCartById(cid);

    if (cartById) {
      if (!cartById.products.length) {
        res.status(404).render("cart", {
          status: false,
          style: "index.css",
          data: "The cart is empty",
        });
      }
      const data = {
        status: true,
        title: "Cart",
        style: "index.css",
        list: cartById.products,
        cid
      };

      res.render("cart", data);
    } else {
      res.status(404).render("cart", {
        status: false,
        style: "index.css",
        data: "Cart not found, please try again later",
      });
    }
  } catch (error) {
    res.redirect("/static/html/failedRequest.html");
  }
});

// CHAT
router.get("/chat", authMiddlewares, (req, res, next) => {
  try {
    const data = {
      status: true,
      title: "Chat",
      style: "index.css",
    };

    res.render("chat", data);
  } catch (error) {
    res.redirect("/static/html/failedRequest.html");
  }
});

module.exports = router;
