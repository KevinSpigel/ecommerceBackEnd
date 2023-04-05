const fs = require("fs/promises");
// const { existsSync } = require("fs");
const uuid = require("uuid");

class CartsFileSystemDao {
  constructor(path) {
    this.path = path;
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
      const newCart = {
        id: uuid(),
        products: [],
      };
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
      const cartById = allCarts.find((cart) => cart.cid === id);
      return cartById;
    } catch (error) {
      throw new Error(`Cart with id: ${cid} was not found: ${error}`);
    }
  }

  async addProductToCart(cid, pid, quantity) {
    const allCarts = await this.getCarts();
    const cartById = await this.getCartById(cid);

    const targetProduct = await cartById.products.find(
      (product) => product.product == pid
    );

    const updatedProduct = targetProduct
      ? {
          product: targetProduct.product,
          quantity: targetProduct.quantity + +quantity,
        }
      : { product: pid, quantity: +quantity };

    const targetCartFiltered = await cartById.products.filter(
      (id) => id.product !== pid
    );
    const updatedCart = {
      ...cartById,
      products: [...targetCartFiltered, updatedProduct],
    };
    const updatedList = allCarts.map((cart) => {
      if (cart.id === cid) {
        return updatedCart;
      } else {
        return cart;
      }
    });

    await this.saveCarts(updatedList);
    return `product id ${pid} update from id cart ${cartById.id} `;
  }

  async deleteProductFromCart(cid, pid) {
    const allCarts = await this.getCarts();
    const cartById = await this.getCartById(cid);

    const targetProduct = await cartById.products.find(
      (product) => product.product == pid
    );

    if (!targetProduct) {
      throw new Error("Product not found");
    } else {
      const filteredCart = await cartById.products.filter(
        (id) => id.product !== pid
      );
      const updatedCart = { ...cartById, products: [...filteredCart] };

      const updatedList = allCarts.map((cart) => {
        if (cart.id === cid) {
          return updatedCart;
        } else {
          return cart;
        }
      });

      await this.saveCarts(updatedList);
      return `product id ${pid} delete from id cart ${cartById.id} `;
    }
  }

  async deleteCart(cid) {
    try {
      const AllCarts = await this.getCarts();
      const filteredById = AllCarts.filter((cart) => cart.cid !== id);
      await this.saveCarts(filteredById);
      return filteredById;
    } catch (error) {
      throw new Error(`Error deleting: ${error.message}`);
    }
  }
}

module.exports = CartsFileSystemDao;
