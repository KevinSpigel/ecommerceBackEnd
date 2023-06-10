const mongoose = require("mongoose");

const userCollection = "users";

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
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
  profile_image: {
    type: String,
  },
  github_username: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "admin", "premium"],
    default: "user",
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
  },
  documents: {
    type: [
      {
        name: String,
        reference: String,
        doctype: {
          type: String,
          enum: ["id_document", "proof_of_address", "account_status"],
        },
      },
    ],
  },
  last_connection: {
    type: String,
    default: Date.now().toLocaleString(),
  },
  update_status: {
    type: Boolean,
    default: false,
  },
});

module.exports = {
  UsersModel: mongoose.model(userCollection, userSchema),
};
