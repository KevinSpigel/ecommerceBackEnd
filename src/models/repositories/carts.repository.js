const { getDAOS } = require("../daos/daosFactory");

const { productsDao, cartsDao } = getDAOS();
class CartsRepository {
  async addCart() {}

  async getAllCarts() {}

  async getCartById() {}

  async updateCart() {}

  async updateQuantityProduct() {}

  async deleteProductFromCart() {}

  async deleteCart() {}
}

module.exports = CartsRepository;
