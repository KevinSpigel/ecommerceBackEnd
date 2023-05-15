const { HTTP_STATUS, HttpError } = require("../../utils/api.utils");
const { getDAOS } = require("../daos/daosFactory");
const { getServices } = require("../../services/app.service");
const { UpdateProductDTO } = require("../dtos/products.dto");
const { TicketDTO } = require("../dtos/tickets.dto");

const { productsDao, cartsDao } = getDAOS();
const { ticketService, messagesService } = getServices();

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
    if (!cid) {
      throw new HttpError(HTTP_STATUS.BAD_REQUEST, "Missing cart ID");
    }
    const cartById = await cartsDao.getCartById(cid);

    if (!cartById) {
      throw new HttpError(HTTP_STATUS.NOT_FOUND, "Cart not found");
    }

    return cartById;
  }

  async updateCart(cid, pid, quantity) {
    if (!quantity || !pid) {
      throw new HttpError(
        HTTP_STATUS.BAD_REQUEST,
        "Missing params. A quantity or product ID of product must be provided"
      );
    }
    const updateProduct = await cartsDao.updateCartProduct(cid, pid, quantity);
    return updateProduct;
  }

  async addProductToCart(cid, pid, quantity, user) {
    const productExist = await productsDao.getProductById(pid);
    if (!productExist) {
      throw new HttpError("Product not found", HTTP_STATUS.NOT_FOUND);
    }
    if (productExist.owner === user.email) {
      throw new HttpError("Can not add own products", HTTP_STATUS.FORBIDDEN);
    }

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
    if (!pid) {
      throw new HttpError("Missing Product ID value", HTTP_STATUS.BAD_REQUEST);
    }
    const deleteProduct = await cartsDao.deleteProductFromCart(cid, pid);
    return deleteProduct;
  }

  async deleteCart(cid) {
    const cartDelete = await cartsDao.deleteCart(cid);
    return cartDelete;
  }

  async purchaseCart(req, cid, purchaser, payload) {
    if (!Array.isArray(payload) || payload.length === 0) {
      throw new HttpError("Missing products", HTTP_STATUS.BAD_REQUEST);
    }

    let totalPrice = 0;

    const notSoldItems = [];

    await payload.forEach(async (item) => {
      if (item.amount > item.product.stock) {
        req.logger.debug(
          `Not enough stock for this item ${item.product.title} with id: ${item.product._id}`
        );
        notSoldItems.push(item);
      } else {
        totalPrice += item.amount * item.product.price;
        await cartsDao.deleteProductFromCart(cid, item.product._id);
        const updateProductPayload = {};
        updateProductPayload.stock = item.product.stock - item.amount;
        if (updateProductPayload.stock === 0) {
          updateProductPayload.status = false;
        }
        const productPayloadDTO = new UpdateProductDTO(updateProductPayload);
        await productsDao.updateProduct(item.product._id, productPayloadDTO);
        req.logger.debug(
          `Item ${item.product.title} deleted from cart: ${cid}`
        );
      }
    });
    const amount = totalPrice;
    if (!amount) {
      throw new HttpError(
        "Not enough stock for purchase any product",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const order = new TicketDTO(purchaser, amount, payload);
    const createNewTicket = await ticketService.generateTicket(order);
    const orderEmail = await messagesService.ticketCreatedEmail(
      createNewTicket
    );
    const orderSMS = await messagesService.ticketCreatedSMS(createNewTicket);
    return createNewTicket;
  }
}

module.exports = new CartsRepository();
