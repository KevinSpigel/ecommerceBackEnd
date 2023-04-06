const ticketsService = require("../../services/tickets.service");
const { HTTP_STATUS, HttpError } = require("../../utils/api.utils");
const { getDAOS } = require("../daos/daosFactory");
const { UpdateProductDTO } = require("../dtos/products.dto");
const { TicketDTO } = require("../dtos/tickets.dto");

const { productsDao, cartsDao } = getDAOS();

class CartsRepository {
  async addCart() {
    let newCart = await cartsDao.addCart();
    return newCart;
  }

  async getAllCarts() {
    const carts = await cartsDao.getCarts();
    return carts;
  }

  async getCartById(cid) {
    const cartById = await cartsDao.getCartById(cid);

    if (!cartById) {
      throw new HttpError(HTTP_STATUS.NOT_FOUND, "Cart not found");
    }

    return cartById;
  }

  async updateCart(cid, pid, quantity) {
    if (!quantity) {
      throw new HttpError(
        HTTP_STATUS.BAD_REQUEST,
        "an amount of product must be provided"
      );
    }
    const updateProduct = await cartsDao.updateCartProduct(cid, pid, quantity);
    return updateProduct;
  }

  async addProductToCart(cid, pid, quantity) {
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

      return addProduct;
    }
  }

  async deleteProductFromCart(cid, pid) {
    const deleteProduct = await cartsDao.deleteProductFromCart(cid, pid);
    return deleteProduct;
  }

  async deleteCart(cid) {
    const cartDelete = await cartsDao.deleteCart(cid);
    return cartDelete;
  }

  async purchaseCart(cid, purchaser, payload) {
    if (!Object.keys(payload).length) {
      throw new HttpError("Missing products", HTTP_STATUS.BAD_REQUEST);
    }
    payload.totalPrice = 0;

    const notSoldItems = [];

    await payload.forEach(async (item) => {
      if (item.amount > item.product.stock) {
        console.log(
          `Not enough stock for this item ${item.product.title} with id: ${item.product._id}`
        );
        notSoldItems.push(item)
      } else {
        payload.totalPrice += item.amount * item.product.price;
        await cartsDao.deleteProductFromCart(cid, item.product._id);
        const updateProductPayload = {};
        updateProductPayload.stock = item.product.stock - item.amount;
        if (updateProductPayload.stock === 0) {
          updateProductPayload.status = false;
        }
        const productPayloadDTO = new UpdateProductDTO(updateProductPayload);
        await productsDao.updateProduct(item.product._id, productPayloadDTO);
        console.log(`Item ${item.product.title} deleted from cart: ${cid}`);
      }
    });
    const amount = payload.totalPrice;
    if (!amount) {
      throw new HttpError(
        "Not enough stock for purchase any product",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const order = new TicketDTO(purchaser, amount, products);
    const createNewTicket = await ticketsService.generateTicket(order);
    return createNewTicket;
  }
}

module.exports = new CartsRepository();
