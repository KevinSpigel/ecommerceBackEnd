const { apiSuccessResponse, HTTP_STATUS } = require("../utils/api.utils");
const {
  transporter,
  twilioClient,
} = require("../utils/messengerService.utils");
const {
  GMAIL_AUTHOR,
  TWILIO_PHONE_NUMBER,
  TWILIO_VERIFIED_CALLER,
} = require("../config/env.config");

const {
  OrdersRepository,
} = require("../models/repositories/orders.repository");

const ordersRepository = new OrdersRepository();

class OrdersController {
  static async getOrders(req, res, next) {
    try {
      const orders = await ordersRepository.getOrders();
      const response = apiSuccessResponse(orders);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getOrderById(req, res, next) {
    const { oid } = req.params;
    try {
      const order = await ordersRepository.getOrderById(oid);
      const response = apiSuccessResponse(order);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async createOrder(req, res, next) {
    const orderPayload = req.body;
    try {
      const newOrder = await ordersRepository.createOrder(orderPayload);
      const response = apiSuccessResponse(newOrder);
      res.status(HTTP_STATUS.CREATED).json(response);

      if (response) {
        const mailParams = {
          from: GMAIL_AUTHOR,
          to: "kevinspigel@gmail.com",
          subject: "CheckOut Confirmation",
          html: 
          `
        <h1>Order confirm ${newOrder.oid}</h1>
        <h3>Thank you!</h3>
        `,
          attachments: [
            {
              filename: "invoicePlaceholder.jpg",
              path: __dirname + "/public/img",
              cid: "PurchaseConfirm",
            },
          ],
        };

        await transporter.sendMail(mailParams);

        await twilioClient.messages.create({
          from: TWILIO_PHONE_NUMBER,
          to: TWILIO_VERIFIED_CALLER,
          body: `Your order: ${newOrder.oid} has been confirmed. Delivery will be made within the next 2 weeks.`,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  static async resolveOrder(req, res, next) {
    const { oid } = req.params;
    const { resolution } = req.body;
    try {
      const updatedOrder = await ordersRepository.resolveOrder(oid, resolution);
      const response = apiSuccessResponse(updatedOrder);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = OrdersController;
