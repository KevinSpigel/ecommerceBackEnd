const { MongoDbConnection } = require("../../../db/mongoDB/mongo.manager");
const { CartsModel } = require("../../schemas/carts.schema");
const { ProductsModel } = require("../../schemas/products.schema");

class CartsMongoDao {
  constructor() {
    MongoDbConnection.getInstance();
  }
  async getCarts() {
    try {
      const allCarts = await CartsModel.find();
      return allCarts;
    } catch (error) {
      throw new Error(`Couldn't read file ${error}`);
    }
  }

  async addCart() {
    try {
      const newCart = await CartsModel.create({ products: [] });
      return newCart;
    } catch (error) {
      throw new Error(`Error saving: ${error}`);
    }
  }

  async getCartById(cid) {
    try {
      const cartById = await CartsModel.findById(cid)
        .populate("products.product")
        .lean();
      return cartById;
    } catch (error) {
      throw new Error(`Cart with id: ${cid} was not found: ${error}`);
    }
  }

  async updateCartProduct(cid, pid, quantity) {
    try {
      const cartById = await this.getCartById(cid);
      const targetProduct = cartById.products.find((p) => p.product._id == pid);

      const productData = await ProductsModel.findById(pid);

      if (!targetProduct) {
        cartById.products.push({
          product: productData._id,
          amount: quantity,
        });
      } else {
        targetProduct.amount += quantity;
      }

      const result = await CartsModel.updateOne({ _id: cid }, cartById);
      return result;
    } catch (error) {
      throw new Error(`Couldn't add the product: ${error}`);
    }
  }

  async deleteProductFromCart(cid, pid) {
    try {
      const cartById = await this.getCartById(cid);

      const targetProduct = cartById.products.find(
        (product) => product.product._id == pid
      );

      if (!targetProduct) {
        throw new Error("Product not found");
      } else {
        cartById.products = cartById.products.filter(
          (p) => p.product._id.toString() !== pid
        );

        const result = await CartsModel.updateOne({ _id: cid }, cartById);
        return result;
      }
    } catch (error) {
      throw new Error(`Error deleting: ${error.message}`);
    }
  }

  async deleteCart(cid) {
    try {
      const cartToClean = await this.getCartById(cid);
      cartToClean.products = [];
      const result = await CartsModel.updateOne({ _id: cid }, cartToClean);
      return result;
    } catch (error) {
      throw new Error(`Error deleting: ${error.message}`);
    }
  }
}

module.exports = CartsMongoDao;
