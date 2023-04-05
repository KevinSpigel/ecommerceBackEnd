const mongoose = require("mongoose");

const userCollection = "users";

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
  },
  password: {
    type: String,
  },
  github_username: {
    type: String,
    unique: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
  },




//DEBERIA TENER TAMBIEN LA ORDEN ASOCIADA. PERO LA ORDEN ASOCIADA TAMBIEN TIENE LA REFERENCIA DEL CART.





});

module.exports = {
  UsersModel: mongoose.model(userCollection, userSchema),
};
