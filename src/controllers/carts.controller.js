const { apiSuccessResponse } = require("../utils/api.utils");
const { HTTP_STATUS } = require("../constants/api.constants");
const { HttpError } = require("../utils/error.utils");

//MONGODB

const CartMongoManager = require("../models/dao/mongoManager/cartManager.mongoose");
const cartsDao = new CartMongoManager();

const ProductMongoManager = require("../models/dao/mongoManager/productManager.mongoose");
const productsDao = new ProductMongoManager();

class CartsController {
  //CREATE cart
  static async addCart(req, res, next) {
    try {
      let newCart = await cartsDao.addCart();
      const response = apiSuccessResponse(newCart);
      res.status(HTTP_STATUS.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  }

  //GET all carts
  static async getCarts(req, res, next) {
    try {
      const carts = await cartsDao.getCarts();
      const response = apiSuccessResponse(carts);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  //GET cart by id
  static async getCartById(req, res, next) {
    try {
      const cid = req.params.cid;

      const cartById = await cartsDao.getCartById(cid);

      if (!cartById) {
        throw new HttpError(HTTP_STATUS.NOT_FOUND, "Cart not found");
      }

      const response = apiSuccessResponse(cartById);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  //POST new product to cart
  static async addProductToCart(req, res) {
    const cid = req.user.cart;
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

        const response = apiSuccessResponse(addProduct);
        res.status(HTTP_STATUS.OK).json(response);
      }
    } catch (error) {
      next(error);
    }
  }

  //PUT update all products. Product list
  static async updatePropertiesProducts(req, res, next) {
    try {
      const cid = req.user.cart;
      const newProducts = req.body;

      const updatedCart = await cartsDao.updatePropertiesProducts(
        cid,
        newProducts
      );
      const response = apiSuccessResponse(updatedCart);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  //PUT update only the quantity of a product
  static async updateCartProduct(req, res, next) {
    const cid = req.user.cart;
    const pid = req.params.pid;
    const quantity = +req.body.quantity;
    try {
      if (!quantity) {
        throw new HttpError(
          HTTP_STATUS.BAD_REQUEST,
          "an amount of product must be provided"
        );
      }
      const updateProduct = await cartsDao.updateCartProduct(
        cid,
        pid,
        quantity
      );
      const response = apiSuccessResponse(updateProduct);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  //DELETE product from cart
  static async deleteProductFromCart(req, res, next) {
    try {
      const cid = req.user.cart;
      const pid = req.params.pid;
      const deleteProduct = await cartsDao.deleteProductFromCart(cid, pid);
      const response = apiSuccessResponse(deleteProduct);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  //DELETE cart by id. Empty cart
  static async deleteCart(req, res, next) {
    try {
      const cid = req.user.cart;
      const cartDelete = await cartsDao.deleteCart(cid);
      const response = apiSuccessResponse(cartDelete);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CartsController;
