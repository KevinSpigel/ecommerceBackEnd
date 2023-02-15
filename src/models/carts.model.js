const mongoose = require("mongoose");
const { productsCollection } = require("./products.model");
const mongoosePaginate = require("mongoose-paginate-v2");


const cartsCollection = "Cart";

const cartsSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: productsCollection,
        },
        amount: {
          type: Number,
        },
      },
    ],
    default: [],
  },
});



cartsSchema.pre("findById", function (next) {
  this.populate("products.product");
next()
});


cartsSchema.plugin(mongoosePaginate);

module.exports = {
  cartsModel: mongoose.model(cartsCollection, cartsSchema),
  cartsCollection,
};
