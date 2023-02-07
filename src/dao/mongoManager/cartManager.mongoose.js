const { cartsModel } = require("../../models/carts.model.js");

class CartMongoManager {
  async getCarts() {
    try {
      const allCarts = await cartsModel.find();
      return allCarts;
    } catch (error) {
      throw new Error(`Couldn't read file ${error}`);
    }
  }

  async addCart() {
    try {
      const newCart = await cartsModel.create({ products: [] });
      return newCart;
    } catch (error) {
      throw new Error(`Error saving: ${error}`);
    }
  }

  async getCartById(cid) {
    try {
      const cartById = await cartsModel.findById(cid).lean();
      return cartById;
    } catch (error) {
      throw new Error(`Cart with id: ${id} was not found: ${error}`);
    }
  }

  async updateCartProduct(cid, pid, quantity) {
    try {
      const cartById = await this.getCartById(cid);
      const targetProduct = cartById.products.find(
        (product) => product.product.id == pid
      );
      if (!targetProduct) {
        cartById.products.push({
          id: pid,
          products: quantity,
        });
      } else {
        targetProduct.products = quantity;
      }
      const result = cartsModel.updateOne(cid, cartById);
      return result;
    } catch (error) {
      throw new Error(`Couldn't add the product: ${error}`);
    }
  }

  async updatePropertiesProducts(cid, newProducts) {
    try {
      const cart = await this.getCartById(cid);
      cart.products = newProducts;
      await cartsModel.updateOne(cid, cart);
      return newProducts;
    } catch (error) {
      throw new Error(`Error updating: ${error}`);
    }
  }

  async deleteProductFromCart(cid, pid) {
    try {
      const cartById = await this.getCartById(cid);

      const targetProduct = cartById.products.find(
        (product) => product.product.id == pid
      );

      if (!targetProduct) {
        throw new Error("Product not found");
      } else {
        cartById.products = cartById.products.filter((p) => p.id === pid);
        const result = cartsModel.updateOne(cid, cartById);
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
      const result = cartsModel.updateOne(cid, cartToClean);
      return result;
    } catch (error) {
      throw new Error(`Error deleting: ${error.message}`);
    }
  }
}

module.exports = CartMongoManager;
