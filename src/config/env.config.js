const dotenv = require("dotenv");
const args = require("./args.config");

const environment = args.mode;

// config
dotenv.config({
  path: `./.env.${environment}`,
});

module.exports = {
  PORT: process.env.PORT || 8080,
  SESSION_KEY: process.env.SESSION_KEY,
  SECRET_KEY: process.env.SECRET_KEY,
  MONGO_URI: process.env.MONGO_URI,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  CALLBACK_URL: process.env.CALLBACK_URL,
};
