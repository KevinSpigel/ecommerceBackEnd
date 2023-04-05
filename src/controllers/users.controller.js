const { apiSuccessResponse, HTTP_STATUS } = require("../utils/api.utils");
const { UsersRepository } = require("../models/repositories/users.repository");

const usersRepository = new UsersRepository();

class UsersController {
  static async getUsers(req, res, next) {
    try {
      const users = await usersRepository.getUsers();
      const response = apiSuccessResponse(users);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req, res, next) {
    const { uid } = req.params;
    try {
      const user = await usersRepository.getUserById(uid);
      const response = apiSuccessResponse(user);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async createUser(req, res, next) {
    const userPayload = req.body;
    try {
      const newUser = await usersRepository.createUser(userPayload);
      const response = apiSuccessResponse(newUser);
      res.status(HTTP_STATUS.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req, res, next) {
    try {
      res.send("OK");
    }
    catch(error) {
      next(error);
    }
  }
}

module.exports = UsersController;
