const { HttpError, HTTP_STATUS } = require("../../utils/api.utils");
const { getDAOS } = require("../daos/daosFactory");

const { usersDao } = getDAOS();

class UsersRepository {
  async getUsers() {
    const users = await usersDao.getUsers();
    return users;
  }

  async getUserById(uid) {
    if (!uid) {
      throw new HttpError("Missing param", HTTP_STATUS.BAD_REQUEST);
    }
    const user = await usersDao.getUserById(uid);
    if (!user) {
      throw new HttpError("User not found", HTTP_STATUS.NOT_FOUND);
    }
    return user;
  }

  async getUserByEmail(email) {
    if (!email) {
      throw new HttpError("Missing param", HTTP_STATUS.BAD_REQUEST);
    }
    const user = await usersDao.getUserByeEmail(email);
    if (!user) {
      throw new HttpError("User not found", HTTP_STATUS.NOT_FOUND);
    }
    return user;
  }

  async createUser(payload) {
    const { first_name, last_name, age, email, password, cart } = payload;
    if (!first_name || !last_name || !age || !email || !password || !cart) {
      throw new HttpError("Missing fields", HTTP_STATUS.BAD_REQUEST);
    }

    const newUserPayload = {
      first_name,
      last_name,
      age,
      email,
      password,
      cart,
      role: "user",
    };

    const newUser = await usersDao.createUser(newUserPayload);
    return newUser;
  }

  async updateUser(uid, payload) {
    if (!uid) {
      throw new HttpError("Missing data from user", HTTP_STATUS.BAD_REQUEST);
    }
    const user = await usersDao.getUserById(uid);
    if (!user) {
      throw new HttpError("User not found", HTTP_STATUS.NOT_FOUND);
    }

    const updatedUser = await usersDao.updateUser(id, payload);
    return updatedUser;
  }

  async deleteUser(uid) {
    if (!uid) {
      throw new HttpError("Must provide an id", HTTP_STATUS.BAD_REQUEST);
    }
    const user = await usersDao.getUserById(uid);
    if (!user) {
      throw new HttpError("User not found", HTTP_STATUS.NOT_FOUND);
    }
    const deletedUser = await usersDao.deleteUser(uid);
    return deletedUser;
  }
}

module.exports = new UsersRepository();
