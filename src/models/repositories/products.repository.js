const { HTTP_STATUS, HttpError } = require("../../utils/api.utils");

const { getDAOS } = require("../daos/daosFactory");

const { productsDao } = getDAOS();

class ProductsRepository {
  constructor() {
    this.dao = productsDao;
  }
  async addProduct() {}

  async getAllProduct() {}

  async getProductById(pid) {
    if (!pid) {
      throw HttpError("Please specify a product ID", HTTP_STATUS.BAD_REQUEST);
    }

    const productById = await productsDao.getProductById(pid);

    if (!productById) {
      throw new HttpError("Product not found", HTTP_STATUS.NOT_FOUND);
    }
    return productById;
  }

  async updateProductById(pid, product) {
    if (!pid || !product) {
      throw HttpError(
        "Please provide an id and a payload for the product",
        HTTP_STATUS.BAD_REQUEST
      );
    }
    const productById = await productsDao.getProductById(pid);

    if (!productById) {
      throw new HttpError("Product not found", HTTP_STATUS.NOT_FOUND);
    }
    const price = product.price ? Number(product.price) : productById.price;
    const stock = product.stock ? Number(product.stock) : productById.stock;
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
    const productUpdated = await productsDao.updateProduct(
      pid,
      newProductProperties
    );
    return productUpdated;
  }

  async deleteProductById(pid) {
    if (!pid) {
      throw HttpError("Please specify a product ID", HTTP_STATUS.BAD_REQUEST);
    }
    const deleteProduct = await productsDao.deleteProduct(pid);
    return deleteProduct;
  }
}

module.exports = new ProductsRepository();
