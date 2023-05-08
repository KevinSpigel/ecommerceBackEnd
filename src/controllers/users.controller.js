const { apiSuccessResponse, HTTP_STATUS } = require("../utils/api.utils");

const usersRepository = require("../models/repositories/users.repository");

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
    const { uid } = req.user;
    try {
      const user = await usersRepository.getUserById(uid);
      const response = apiSuccessResponse(user);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getUserByEmail(req, res, next) {
    const { email } = req.user;
    try {
      const user = await usersRepository.getUserByEmail(email);
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
    const { payload, email } = req.user;
    try {
      const updatedUser = await usersRepository.updateUser(payload, email);
      const response = apiSuccessResponse(updatedUser);
      return res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async changeRole(req, res, next) {
    const { uid } = req.params;
    try {
      const updatedUser = await usersRepository.updateUserRole(uid);
      const response = apiSuccessResponse(updatedUser);
      return res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req, res, next) {
    const { uid } = req.user;
    try {
      const deletedUser = await usersRepository.deleteUser(uid);
      const response = apiSuccessResponse(deletedUser);
      return res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UsersController;
