const mongoose = require("mongoose");

const ordercollection = "orders";
const orderSchema = new mongoose.Schema({
  order_number: { type: String, required: true },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  status: {
    type: String,
    enum: ["PENDING", "REJECTED", "COMPLETED"],
    default: "PENDING",
  },
  products: [
    {
      reference: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
      },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  total_price: {
    type: Number,
    default: 0,
  },



//SI SE HACE UN RECIBO DEBERIA APARECER TODOS LOS PRODUCTOS DE ESE RECIBO Y DEBERIA SER TODOS LOS PRODUCTOS DEL CART QUE YA ESTARIAN POR REFERENCIA EN EL PARAMETRO "CART"



});

module.exports = {
  OrdersModel: mongoose.model(ordercollection, orderSchema),
};
