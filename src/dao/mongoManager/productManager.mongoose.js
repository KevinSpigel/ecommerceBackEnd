const { productsModel } = require("../../models/products.model.js");

class ProductMongoManager {
  async getProducts(limit, page, sort, query) {
    try {
      const options = { limit, page, sort };
      const allProducts = await productsModel.paginate(query, options);
      return allProducts;
    } catch (error) {
      throw new Error(`Couldn't read file ${error}`);
    }
  }

  async addProduct(
    title,
    description,
    code,
    price,
    thumbnail,
    stock,
    category,
    status
  ) {
    try {
      const obj = {
        title,
        description,
        code,
        price,
        thumbnail,
        stock,
        category,
        status,
      };
      const newProduct = await productsModel.create(obj);
      return newProduct;
    } catch (error) {
      throw new Error(`Error saving: ${error}`);
    }
  }

  async getProductById(pid) {
    try {
      const productById = await productsModel.findById(pid);
      return productById;
    } catch (error) {
      throw new Error(`Product with id: ${pid} was not found: ${error}`);
    }
  }

  async updateProduct(pid, newProductProperties) {
    try {
      const productUpdated = await productsModel.findByIdAndUpdate(
        pid,
        newProductProperties
      );
      return productUpdated;
    } catch (error) {
      throw new Error(`Error updating ${error}`);
    }
  }

  async deleteProduct(pid) {
    try {
      const response = await productsModel.findByIdAndDelete(pid);
      return `Product with id: ${response.id} was deleted successfully`;
    } catch (error) {
      throw new Error(`Error deleting: ${error}`);
    }
  }
}

module.exports = ProductMongoManager;
