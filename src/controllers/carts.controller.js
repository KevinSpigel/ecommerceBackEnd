//MONGODB

const CartMongoManager = require("../dao/mongoManager/cartManager.mongoose");
const cartsDao = new CartMongoManager();

const ProductMongoManager = require("../dao/mongoManager/productManager.mongoose");
const productsDao = new ProductMongoManager();

class CartsController {
  //CREATE cart
  static async addCart(req, res) {
    try {
      let newCart = await cartsDao.addCart();
      res.send({ status: "success", message: newCart });
    } catch (error) {
      res.status(500).send({
        status: "error",
        error: error.message,
      });
    }
  }

  //GET all carts
  static async getCarts(req, res) {
    try {
      let carts = await cartsDao.getCarts();
      const cartLimit = req.query.limit;

      let integerCartLimit;

      if (cartLimit) {
        integerCartLimit = parseInt(cartLimit);
        if (isNaN(integerCartLimit)) {
          return res.status(400).send({
            status: "error",
            error: "cartLimit must be a valid number",
          });
        }
        if (integerCartLimit <= 0 || integerCartLimit > carts.length) {
          return res
            .status(404)
            .send({ status: "error", error: "Carts not found" });
        }
      }

      if (integerCartLimit) carts = carts.slice(0, integerCartLimit);

      res.send({ status: "success", payload: carts });
    } catch (error) {
      res.status(500).send({
        status: "error",
        error: error.message,
      });
    }
  }

  //GET cart by id
  static async getCartById(req, res) {
    try {
      const cid = req.params.cid;

      const cartById = await cartsDao.getCartById(cid);

      if (!cartById) {
        return res.status(404).send({ status: "error", error: error.message });
      }

      res.send({ status: "success", payload: cartById });
    } catch (error) {
      res.status(500).send({
        status: "error",
        error: error.message,
      });
    }
  }

  //POST new product to cart
  static async addProductToCart(req, res) {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = +req.query.quantity;

    try {
      const productExist = await productsDao.getProductById(pid);

      if (productExist) {
        let defaultQuantity;

        if (!quantity) {
          defaultQuantity = 1;
        } else {
          defaultQuantity = quantity;
        }

        const addProduct = await cartsDao.updateCartProduct(
          cid,
          pid,
          defaultQuantity
        );
        res.send({ status: "success", message: addProduct });
      }
    } catch (error) {
      res.status(500).send({
        status: "error",
        error: error.message,
      });
    }
  }

  //PUT update all products. Product list
  static async updatePropertiesProducts(req, res) {
    try {
      const cid = req.params.cid;
      const newProducts = req.body;

      const updatedCart = await cartsDao.updatePropertiesProducts(
        cid,
        newProducts
      );
      res.send({
        status: "success",
        payload: updatedCart,
      });
    } catch (error) {
      res.status(500).send({
        status: "error",
        error: error.message,
      });
    }
  }

  //PUT update only the quantity of a product
  static async updateCartProduct(req, res) {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = +req.body.quantity;
    try {
      if (!quantity) {
        throw new Error("an amount of product must be provided");
      }
      const updateProduct = await cartsDao.updateCartProduct(
        cid,
        pid,
        quantity
      );
      res.send({
        status: "success",
        payload: updateProduct,
      });
    } catch (error) {
      res.status(500).send({
        status: "error",
        error: error.message,
      });
    }
  }

  //DELETE product from cart
  static async deleteProductFromCart(req, res) {
    try {
      const cid = req.params.cid;
      const pid = req.params.pid;
      const deleteProduct = await cartsDao.deleteProductFromCart(cid, pid);
      res.send({ status: "success", message: deleteProduct });
    } catch (error) {
      res.status(500).send({
        status: "error",
        error: error.message,
      });
    }
  }

  //DELETE cart by id. Empty cart
  static async deleteCart(req, res) {
    try {
      const cid = req.params.cid;
      const cartDelete = await cartsDao.deleteCart(cid);
      res.send({ status: "success", message: cartDelete });
    } catch (error) {
      res.status(500).send({
        status: "error",
        error: error.message,
      });
    }
  }
}

module.exports = CartsController;
