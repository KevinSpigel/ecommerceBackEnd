// Bcrypt

const bcrypt = require("bcrypt");

const hashPassword = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10)); // 10 is the default value

const isValidPassword = (userDB, password) =>
  bcrypt.compareSync(password, userDB.password);

module.exports = {
  hashPassword,
  isValidPassword,
};
