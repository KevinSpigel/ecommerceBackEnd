const { Router } = require("express");
const uploader = require("../utils");
// const {options} = require("../config/options");

const { auth } = require("../middlewares/auth.middleware");
const { sessionMiddleware } = require("../middlewares/session.middleware");

const router = Router();

//MONGODB

const ProductMongoManager = require("../dao/mongoManager/productManager.mongoose");
const CartMongoManager = require("../dao/mongoManager/cartManager.mongoose");

const ecommerce = new ProductMongoManager();
const ecommerceCarts = new CartMongoManager();

//LOGIN

router.get("/", sessionMiddleware, (req, res) => {
  res.redirect("/login");
});

router.get("/login", sessionMiddleware, (req, res) => {
  const data = {
    status: true,
    title: "Login",
    style: "index.css",
  };

  res.render("login", data);
});

//REGISTER

router.get("/register", sessionMiddleware, (req, res) => {
  const data = {
    status: true,
    title: "Register",
    style: "index.css",
  };

  res.render("register", data);
});


//PRODUCTS

router.get("/products", auth, async (req, res) => {
  const product = await ecommerce.getProducts(req.query);
  const user = await req.session.user;

  if (product.docs && product.docs != false) {
    const data = {
      status: true,
      title: "Real Time Products",
      style: "index.css",
      list: product.docs,
      user: user,
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

  console.log("test", cartById);

  if (cartById) {
    const data = {
      status: true,
      title: "Cart",
      style: "index.css",
      list: cartById,
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

//FILESYSTEM

// const ProductManager = require("../dao/fileManager/ProductManager");

// const ecommerce = new ProductManager(options.FileSystem.products);

// router.get("/", async (req, res) => {
//   const product = await ecommerce.getProducts();

//   if (product && (product != false)) {
//     const data = {
//       status: true,
//       title: "Home",
//       style: "index.css",
//       list: product,
//     };

//     res.render("home", data);
//   } else {
//     return res.status(404).render("home", {
//       status: false,
//       style: "index.css",
//       data: "Empty list",
//     });
//   }
// });

// router.get("/realtimeproducts", async (req, res) => {
//   const product = await ecommerce.getProducts();

//   if (product && (product != false)) {
//     const data = {
//       status: true,
//       title: "Real Time Products",
//       style: "index.css",
//       list: product,
//     };

//     res.render("realTimeProducts", data);
//   } else {
//     return res.status(404).render("realTimeProducts", {
//       status: false,
//       style: "index.css",
//       data: "Empty list",
//     });
//   }
// });

// router.post(
//   "/realtimeproducts",
//   uploader.single("thumbnail"),
//   async (req, res) => {
//     const addNewProduct = req.body;
//     const socket = req.app.get("socket");
//     const filename = req.file.filename;

//     const newProduct = await ecommerce.addProduct(
//       addNewProduct.title,
//       addNewProduct.description,
//       addNewProduct.code,
//       +addNewProduct.price,
//       (addNewProduct.thumbnail = filename),
//       +addNewProduct.stock,
//       addNewProduct.category,
//       addNewProduct.status
//     );
//     socket.emit("newProduct", newProduct);
//     res.send({ status: "success" });
//   }
// );

// module.exports = router;
