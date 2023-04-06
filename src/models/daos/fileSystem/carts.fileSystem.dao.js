const fs = require("fs/promises");
const { CartsModel } = require("../../schemas/carts.schema");

class CartsFileSystemDao {
  constructor(path, productsDao) {
    this.path = path;
    this.productsDao = productsDao;
  }

  async getCarts() {
    try {
      const dataCarts = await fs.readFile(this.path, "utf-8");
      const allCarts = JSON.parse(dataCarts);
      return allCarts;
    } catch (error) {
      throw new Error(`Couldn't read file ${error}`);
    }
  }

  async saveCarts(allCarts) {
    await fs.writeFile(this.path, JSON.stringify(allCarts, null, "\t"));
  }

  async addCart() {
    try {
      const data = await this.getCarts();
      const newCart = new CartsModel();
      data.push(newCart);
      await this.saveCarts(data);
      return newCart;
    } catch (error) {
      throw new Error(`Error saving: ${error}`);
    }
  }

  async getCartById(cid) {
    try {
      const allCarts = await this.getCarts();
      const cartById = allCarts.find((cart) => cart._id === cid);
      const allProducts = await this.productsDao.getProducts();

      cartById.products = cartById.products.map((p) => {
        const filteredProduct = allProducts.find(
          (product) => product._id === p.product
        );
        return {
          product: {
            ...filteredProduct,
          },
          amount: p.amount,
        };
      });

      return cartById;
    } catch (error) {
      throw new Error(`Cart with id: ${cid} was not found: ${error}`);
    }
  }

  async updateCartProduct(cid, pid, quantity) {
    try {
      const allCarts = await this.getCarts();

      const cartIndex = allCarts.findIndex((c) => c._id === cid);

      const cartById = allCarts[cartIndex];
      const productIndex = cartById.products.findIndex(
        (product) => product.product === pid
      );

      if (productIndex >= 0) {
        cartById.products[productIndex] = {
          product: targetProduct.product,
          amount: targetProduct.amount + +quantity,
        };
      } else {
        cartById.products.push({ product: pid, amount: +quantity });
      }

      allCarts[cartIndex] = cartById;

      await this.saveCarts(allCarts);
      return `product id ${pid} update from id cart ${cid} `;
    } catch (error) {
      throw new Error(`Couldn't add the product: ${error}`);
    }
  }

  async deleteProductFromCart(cid, pid) {
    try {
      const allCarts = await this.getCarts();

      const cartIndex = allCarts.findIndex((c) => c._id === cid);

      const cartById = allCarts[cartIndex];

      const targetProduct = await cartById.products.find(
        (product) => product.product === pid
      );

      if (!targetProduct) {
        throw new Error("Product not found");
      } else {
        const filteredCart = await cartById.products.filter(
          (id) => id.product !== pid
        );
        const updatedCart = { ...cartById, products: [...filteredCart] };

        allCarts[cartIndex] = updatedCart;

        await this.saveCarts(allCarts);
        return `product id ${pid} delete from id cart ${cid} `;
      }
    } catch (error) {
      throw new Error(`Error deleting: ${error.message}`);
    }
  }

  async deleteCart(cid) {
    try {
      const AllCarts = await this.getCarts();
      const filteredById = AllCarts.filter((cart) => cart._id !== cid);
      await this.saveCarts(filteredById);
      return filteredById;
    } catch (error) {
      throw new Error(`Error deleting: ${error.message}`);
    }
  }
}

module.exports = CartsFileSystemDao;
