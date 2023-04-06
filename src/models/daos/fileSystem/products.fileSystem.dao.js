const fs = require("fs/promises");
const { ProductsModel } = require("../../schemas/products.schema");

class ProductsFileSystemDao {
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    try {
      const dataProducts = await fs.readFile(this.path, "utf-8");
      const allProducts = JSON.parse(dataProducts);
      allProducts.forEach((product) => {
        product.id = Number(product.id);
      });
      return allProducts;
    } catch (error) {
      throw new Error(`Couldn't read file ${error}`);
    }
  }

  async saveProducts(allProducts) {
    await fs.writeFile(this.path, JSON.stringify(allProducts, null, "\t"));
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
      const allProducts = await this.getProducts();
      if (
        !allProducts.find((product) => product.code === code) &&
        title &&
        description &&
        code &&
        price &&
        thumbnail &&
        stock &&
        category &&
        status
      ) {
        const newProduct = new ProductsModel({
          title,
          description,
          code,
          price,
          thumbnail,
          stock,
          category,
          status,
        });

        allProducts.push(newProduct);

        await this.saveProducts(allProducts);

        return newProduct;
      }
    } catch (error) {
      throw new Error(`Error saving: ${error}`);
    }
  }

  async getProductById(pid) {
    try {
      const allProducts = await this.getProducts();
      const productById = allProducts.find((product) => product._id === pid);
      return productById;
    } catch (error) {
      throw new Error(`Product with id: ${pid} was not found: ${error}`);
    }
  }

  async updateProduct(id, newProductProperties) {
    try {
      const allProducts = await this.getProducts();
      const productById = await this.getProductById(id);

      const productUpdates = { ...productById, ...newProductProperties };

      const updatedProduct = allProducts.map((product) => {
        if (product._id === productUpdates._id) {
          return productUpdates;
        } else {
          return product;
        }
      });

      await this.saveProducts(updatedProduct);

      return updatedProduct;
    } catch (error) {
      throw new Error(`Error updating ${error}`);
    }
  }

  async deleteProduct(pid) {
    try {
      const allProducts = await this.getProducts();
      const filteredById = allProducts.filter((product) => product._id !== pid);
      await this.saveProducts(filteredById);
      return `Product with id: ${pid} was deleted successfully`;
    } catch (error) {
      throw new Error(`Error deleting: ${error}`);
    }
  }
}

module.exports = ProductsFileSystemDao;
