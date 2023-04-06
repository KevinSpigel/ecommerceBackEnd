const {
  apiSuccessResponse,
  HTTP_STATUS,
  HttpError,
} = require("../utils/api.utils");
const { generateToken } = require("../utils/jwt.utils");
const { hashPassword, isValidPassword } = require("../utils/hash.utils");
const { SESSION_KEY } = require("../config/env.config");

const { getDAOS } = require("../models/daos/daosFactory");
const sessionsRepository = require("../models/repositories/sessions.repository");

const { cartsDao, usersDao } = getDAOS();

class SessionsController {
  static async register(req, res, next) {
    try {
      const { first_name, last_name, age, email, password } = req.body;
      const user = await usersDao.getUserByEmail(email);
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
      const createdUser = await usersDao.createdUser(newUser);

      const userForCookie = {
        first_name: createdUser.first_name,
        last_name: createdUser.last_name,
        age: createdUser.age,
        email: createdUser.email,
        cart: createdUser.cart,
        role: createdUser.role,
      };

      const access_token = generateToken(userForCookie);
      res.cookie(SESSION_KEY, access_token, {
        maxAge: 60 * 60 * 60 * 24 * 1000,
        httpOnly: true,
      });
      const response = apiSuccessResponse("User registered successfully!");
      return res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await usersDao.getUserByEmail(email);
      if (!user || !isValidPassword(user, password)) {
        throw new HttpError(HTTP_STATUS.BAD_REQUEST, "Wrong email or password");
      }
      const userForCookie = {
        first_name: user.first_name,
        last_name: user.last_name,
        age: user.age,
        email: user.email,
        cart: user.cart,
        role: user.role,
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
      res.json({ message: "Session close" });
    } catch (error) {
      next(error);
    }
  }

  static async currentSession(req, res, next) {
    const currentUser = sessionsRepository.getUserSession(req);
    const response = apiSuccessResponse(currentUser);
    return res.json(response);
  }
}

module.exports = SessionsController;
