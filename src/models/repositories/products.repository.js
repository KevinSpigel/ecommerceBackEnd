const {
  apiSuccessResponse,
  HTTP_STATUS,
  HttpError,
} = require("../../utils/api.utils");
const { PORT } = require("../../config/env.config");

const { getDAOS } = require("../daos/daosFactory");

const { productsDao } = getDAOS();

class ProductsRepository {
  constructor() {
    this.dao = productsDao;
  }
  async addProduct() {}

  async getAllProduct() {}

  async getProductById() {}

  async updateProductById() {}

  async deleteProductById() {}
}

module.exports = new ProductsRepository();
