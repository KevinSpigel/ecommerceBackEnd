const { HttpError, HTTP_STATUS } = require("../../utils/api.utils");
const { hashPassword } = require("../../utils/hash.utils");
const { getDAOS } = require("../daos/daosFactory");

const { usersDao, cartsDao } = getDAOS();

class UsersRepository {
  async getUsers() {
    const users = await usersDao.getUsers();
    return users;
  }

  async getUserById(uid) {
    if (!uid) {
      throw new HttpError(HTTP_STATUS.BAD_REQUEST, "Missing param");
    }
    const user = await usersDao.getUserById(uid);
    if (!user) {
      throw new HttpError(HTTP_STATUS.NOT_FOUND, "User not found");
    }
    return user;
  }

  async getUserByEmail(email) {
    if (!email) {
      throw new HttpError(HTTP_STATUS.BAD_REQUEST, "Missing param");
    }
    const user = await usersDao.getUserByeEmail(email);
    if (!user) {
      throw new HttpError(HTTP_STATUS.NOT_FOUND, "User not found");
    }
    return user;
  }

  async createUser(payload) {
    const { first_name, last_name, age, email, password, cart } = payload;
    if (!first_name || !last_name || !age || !email || !password || !cart) {
      throw new HttpError(HTTP_STATUS.BAD_REQUEST, "Missing fields");
    }
    const user = await usersDao.getUserByEmail(email);
    if (user) {
      throw new HttpError(HTTP_STATUS.BAD_REQUEST, "User already exist");
    }

    const cartForNewUser = await cartsDao.addCart();

    const newUserPayload = {
      first_name,
      last_name,
      age,
      email,
      password: hashPassword(password),
      cart: cartForNewUser,
      role: "user",
    };

    const newUser = await usersDao.createUser(newUserPayload);
    return newUser;
  }

  async updateUser(payload, email) {
    if (!email) {
      throw new HttpError(HTTP_STATUS.BAD_REQUEST, "Missing data from user");
    }
    const user = await usersDao.getUserByEmail(email);
    if (!user) {
      throw new HttpError(HTTP_STATUS.NOT_FOUND, "User not found");
    }

    const updatedUser = await usersDao.updateUserByEmail(payload, email);
    return updatedUser;
  }

  async deleteUser(uid) {
    if (!uid) {
      throw new HttpError(HTTP_STATUS.BAD_REQUEST, "Must provide an id");
    }
    const user = await usersDao.getUserById(uid);
    if (!user) {
      throw new HttpError(HTTP_STATUS.NOT_FOUND, "User not found");
    }
    const deletedUser = await usersDao.deleteUser(uid);
    return deletedUser;
  }
}

module.exports = new UsersRepository();
