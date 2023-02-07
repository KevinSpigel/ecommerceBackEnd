const { Router } = require("express");

const uploader = require("../../utils");

// const {options} = require("../../config/options");

const router = Router();

//MONGODB

const ProductMongoManager = require("../../dao/mongoManager/productManager.mongoose");

const ecommerce = new ProductMongoManager();

// Routes

//CREATE new product

router.post("", uploader.single("thumbnail"), async (req, res) => {
  try {
    const addNewProduct = req.body;
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

    res.send({ status: "success", payload: newProduct });
  } catch (error) {
    res.status(500).send({
      status: "error",
      error: error.message,
    });
  }
});

//GET all products + query param + paginate

router.get("", async (req, res) => {
  const limit = Number(req.query.limit);
  const page = Number(req.query.page);
  const sort = req.query.sort;
  const query = req.query.query;

  const products = await ecommerce.getProducts(limit, page, sort, query);
  
  const response = {
    status: "success",
    payload: products.docs,
    totalPages: products.totalPages,
    prevPage: products.prevPage,
    nextPage: products.nextPage,
    page: products.page,
    hasPrevPage: products.hasPrevPage,
    hasNextPage: products.hasNextPage,
    prevLink: null,
    nexLink: null,
  };

  res.send({ response });
});

//GET product by id

router.get("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;

    if (isNaN(productId)) {
      return res
        .status(400)
        .send({ status: "error", error: "productId must be a valid number" });
    }

    const integerProductId = parseInt(productId);

    if (integerProductId <= 0) {
      res.status(404).send({ status: "error", error: "Product not found" });
    }

    const productById = await ecommerce.getProductById(integerProductId);

    if (!productById) {
      return res
        .status(404)
        .send({ status: "error", error: "Product not found" });
    }

    res.send({ status: "success", payload: productById });
  } catch (error) {
    res.status(500).send({
      status: "error",
      error: error.message,
    });
  }
});

//UPDATE product by id
router.put("/:pid", async (req, res) => {
  try {
    const pid = +req.params.pid;
    const product = req.body;
    const productById = await ecommerce.getProductById(pid);
    const price = product.price ? +product.price : productById.price;
    const stock = product.stock ? +product.stock : productById.stock;
    const thumbnail = product.thumbnail
      ? +product.thumbnail
      : productById.thumbnail;
    const status = product.status ? +product.status : productById.status;
    const newProductProperties = {
      ...product,
      thumbnail,
      price,
      stock,
      status,
    };
    const productUpdated = await ecommerce.updateProduct(
      pid,
      newProductProperties
    );
    res.send({ status: "success", message: productUpdated });
  } catch (error) {
    res.status(500).send({
      status: "error",
      error: error.message,
    });
  }
});

//DELETE product by id

router.delete("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;

    if (isNaN(productId)) {
      return res
        .status(400)
        .send({ status: "error", error: "productId must be a valid number" });
    }

    const integerProductId = parseInt(productId);

    if (integerProductId <= 0) {
      res.status(404).send({ status: "error", error: "Product not found" });
    }

    const deleteProduct = await ecommerce.deleteProduct(integerProductId);

    if (!deleteProduct) {
      return res
        .status(404)
        .send({ status: "error", error: "Product not found" });
    }

    res.send({ status: "success", payload: deleteProduct });
  } catch (error) {
    res.status(500).send({
      status: "error",
      error: error.message,
    });
  }
});

module.exports = router;

//FILESYSTEM

// const ProductManager = require("../../dao/fileManager/ProductManager");
// const ecommerce = new ProductManager(options.FileSystem.products);

// // Routes

// //CREATE new product

// router.post("", uploader.single("thumbnail"), async (req, res) => {
//   const addNewProduct = req.body;
//   const filename= req.file.filename;

//   const newProduct = await ecommerce.addProduct(
//     addNewProduct.title,
//     addNewProduct.description,
//     addNewProduct.code,
//     +addNewProduct.price,
//     addNewProduct.thumbnail= filename,
//     +addNewProduct.stock,
//     addNewProduct.category,
//     addNewProduct.status
//   );

//   res.send({ status: "success", payload: newProduct });
// });

// //GET all products + query limit param

// router.get("", async (req, res) => {
//   let products = await ecommerce.getProducts();
//   const productsLimit = req.query.limit;

//   let integerProductsLimit;

//   if (productsLimit) {
//     integerProductsLimit = parseInt(productsLimit);
//     if (isNaN(integerProductsLimit)) {
//       return res.status(400).send({
//         status: "error",
//         error: "productsLimit must be a valid number",
//       });
//     }
//     if (integerProductsLimit <= 0 || integerProductsLimit > products.length) {
//       return res
//         .status(404)
//         .send({ status: "error", error: "Products not found" });
//     }
//   }

//   if (integerProductsLimit) products = products.slice(0, integerProductsLimit);

//   res.send({ status: "success", payload: products });
// });

// //GET product by id

// router.get("/:pid", async (req, res) => {
//   const productId = req.params.pid;

//   if (isNaN(productId)) {
//     return res
//       .status(400)
//       .send({ status: "error", error: "productId must be a valid number" });
//   }

//   const integerProductId = parseInt(productId);

//   if (integerProductId <= 0) {
//     res.status(404).send({ status: "error", error: "Product not found" });
//   }

//   const productById = await ecommerce.getProductById(integerProductId);

//   if (!productById) {
//     return res
//       .status(404)
//       .send({ status: "error", error: "Product not found" });
//   }

//   res.send({ status: "success", payload: productById });
// });

// //UPDATE product by id
// router.put("/:pid", async (req, res) => {
//   const pid = +req.params.pid;
//   const product = req.body;
//   const productById = await ecommerce.getProductById(pid);
//   const price = product.price ? +product.price : productById.price;
//   const stock = product.stock ? +product.stock : productById.stock;
//   const thumbnail = product.thumbnail
//     ? +product.thumbnail
//     : productById.thumbnail;
//   const status = product.status ? +product.status : productById.status;
//   const newProductProperties = {
//     ...product,
//     thumbnail,
//     price,
//     stock,
//     status,
//   };
//   const productUpdated = await ecommerce.updateProduct(
//     pid,
//     newProductProperties
//   );
//   res.send({ status: "success", message: productUpdated });
// });

// //DELETE product by id

// router.delete("/:pid", async (req, res) => {
//   const productId = req.params.pid;

//   if (isNaN(productId)) {
//     return res
//       .status(400)
//       .send({ status: "error", error: "productId must be a valid number" });
//   }

//   const integerProductId = parseInt(productId);

//   if (integerProductId <= 0) {
//     res.status(404).send({ status: "error", error: "Product not found" });
//   }

//   const deleteProduct = await ecommerce.deleteProduct(integerProductId);

//   if (!deleteProduct) {
//     return res
//       .status(404)
//       .send({ status: "error", error: "Product not found" });
//   }

//   res.send({ status: "success", payload: deleteProduct });
// });

// module.exports = router;
