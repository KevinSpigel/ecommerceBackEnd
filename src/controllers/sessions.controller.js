const { apiSuccessResponse } = require("../utils/api.utils");
const { HTTP_STATUS } = require("../constants/api.constants");
const { HttpError } = require("../utils/error.utils");
const { userModel } = require("../models/schemas/users.model");
const { generateToken } = require("../utils/jwt.utils");
const { hashPassword, isValidPassword } = require("../utils/hash.utils");
const { SESSION_KEY } = require("../constants/sessions.constants");

const CartMongoManager = require("../models/dao/mongoManager/cartManager.mongoose");
const cartsDao = new CartMongoManager();

class SessionsController {
  static async register(req, res, next) {
    try {
      const { first_name, last_name, age, email, password } = req.body;
      const user = await userModel.findOne({ email });
      if (user) {
        return res.status(400).json({ error: "User already exist" });
      }

      const cartForNewUser = await cartsDao.addCart();

      const newUser = {
        first_name,
        last_name,
        age,
        email,
        password: hashPassword(password),
        cart: cartForNewUser._id,
      };
      await userModel.create(newUser);

      const userForCookie = {
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        age: newUser.age,
        email: newUser.email,
        cart: newUser.cart,
      };

      const access_token = generateToken(userForCookie);
      res.cookie(SESSION_KEY, access_token, {
        maxAge: 60 * 60 * 60 * 24 * 1000,
        httpOnly: true,
      });
      const response = apiSuccessResponse("User registered successfully!");
      return res.json(response);
    } catch (error) {
      console.log(error, "error del register");
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await userModel.findOne({ email });
      if (!user || !isValidPassword(user, password)) {
        throw new HttpError(HTTP_STATUS.BAD_REQUEST, "Wrong email or password");
      }
      const userForCookie = {
        first_name: user.first_name,
        last_name: user.last_name,
        age: user.age,
        email: user.email,
        cart: user.cart,
      };
      const access_token = generateToken(userForCookie);

      res.cookie(SESSION_KEY, access_token, {
        maxAge: 60 * 60 * 60 * 24 * 1000,
        httpOnly: true,
      });
      const response = apiSuccessResponse("User logued in successfully!");
      return res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async loginGithub(req, res, next) {
    try {
      const user = req.user;
      const access_token = generateToken(user);
      res.cookie(SESSION_KEY, access_token, {
        maxAge: 60 * 60 * 60 * 24 * 1000,
        httpOnly: true,
      });
      const response = apiSuccessResponse(
        "User logued in successfully with github!"
      );
      return res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async logOut(req, res, next) {
    try {
      res.clearCookie("my-session");
      res.json({message:"Session close"})
    } catch (error) {
      next(error);
    }
  }

  static async currentSession(req, res, next) {
    const response = apiSuccessResponse(req.user);
    return res.json(response);
  }
}

module.exports = SessionsController;
