const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../src/config/constants");

const generateToken = (user) => {
  const token = jwt.sign({ user }, SECRET_KEY, { expiresIn: "24h" });
  return token;
};

module.exports = { generateToken };
