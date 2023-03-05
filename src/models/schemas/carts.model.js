const mongoose = require("mongoose");

const cartsCollection = "carts";

const cartsSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
        amount: {
          type: Number,
        },
      },
    ],
    default: [],
  },
});

module.exports = {
  cartsModel: mongoose.model(cartsCollection, cartsSchema),
};
