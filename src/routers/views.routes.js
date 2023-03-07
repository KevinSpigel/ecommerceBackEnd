const { Router } = require("express");
const uploader = require("../utils/multer.utils");
const { passportCustom } = require("../middlewares/passportCustom.middleware");
const { authToken } = require("../middlewares/authToken.middleware");



const router = Router();



//MONGODB

const ProductMongoManager = require("../models/dao/mongoManager/productManager.mongoose");
const CartMongoManager = require("../models/dao/mongoManager/cartManager.mongoose");

const ecommerce = new ProductMongoManager();
const ecommerceCarts = new CartMongoManager();

//LOGIN

router.get("/", (req, res) => {
  res.redirect("/login");
});

router.get("/login", (req, res) => {
  const data = {
    status: true,
    title: "Login",
    style: "index.css",
  };

  res.render("login", data);
});

//REGISTER

router.get("/register", (req, res) => {
  const data = {
    status: true,
    title: "Register",
    style: "index.css",
  };

  res.render("register", data);
});

//PRODUCTS
router.use(passportCustom("jwt"), authToken ); //this middleware is going to be available for all router from here.

router.get("/products", async (req, res) => {
  const product = await ecommerce.getProducts(req.query);
  const user=req.user

  if (product.docs) {
    const data = {
      status: true,
      title: "Real Time Products",
      style: "index.css",
      list: product.docs,
      user
    };

    res.render("realTimeProducts", data);
  } else {
    return res.status(404).render("realTimeProducts", {
      status: false,
      style: "index.css",
      data: "Empty list",
    });
  }
});

router.post("/products", uploader.single("thumbnail"), async (req, res) => {
  const addNewProduct = req.body;
  const socket = req.app.get("socket");
  const filename = req.file.filename;

  const newProduct = await ecommerce.addProduct(
    addNewProduct.title,
    addNewProduct.description,
    addNewProduct.code,
    +addNewProduct.price,
    (addNewProduct.thumbnail = filename),
    +addNewProduct.stock,
    addNewProduct.category,
    addNewProduct.status
  );
  socket.emit("newProduct", newProduct);
  res.send({ status: "success" });
});

//CART

router.get("/cart/:cid", async (req, res) => {
  const cid = req.params.cid;
  const cartById = await ecommerceCarts.getCartById(cid);

  if (cartById) {
    const data = {
      status: true,
      title: "Cart",
      style: "index.css",
      list: cartById.products,
    };

    res.render("cart", data);
  } else {
    return res.status(404).render("cart", {
      status: false,
      style: "index.css",
      data: "The cart is empty",
    });
  }
});

// CHAT
router.get("/chat", (req, res) => {
  const data = {
    status: true,
    title: "Chat",
    style: "index.css",
  };

  res.render("chat", data);
});

module.exports = router;