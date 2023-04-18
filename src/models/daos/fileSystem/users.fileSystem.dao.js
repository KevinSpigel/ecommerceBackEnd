const fs = require("fs/promises");
const { UsersModel } = require("../../schemas/users.schema");

class UsersFileSystemDao {
  constructor(path, cartsDao) {
    this.path = path;
    this.cartsDao = cartsDao;
  }
  async getUsers() {
    try {
      const dataUsers = await fs.readFile(this.path, "utf-8");
      const allUsers = JSON.parse(dataUsers);
      return allUsers;
    } catch (error) {
      throw new Error(`Couldn't read file ${error}`);
    }
  }

  async saveUsers(allUsers) {
    await fs.writeFile(this.path, JSON.stringify(allUsers, null, "\t"));
  }

  async getUserById(id) {
    try {
      const allUsers = await this.getUsers();
      const userById = allUsers.find((user) => user._id === id);
      return userById;
    } catch (error) {
      throw new Error("User not found");
    }
  }

  async getUserByEmail(email) {
    try {
      const allUsers = await this.getUsers();
      const userByEmail = allUsers.find((user) => user.email === email);
      return userByEmail;
    } catch (error) {
      throw new Error("User not found");
    }
  }

  async createUser(payload) {
    try {
      const allUsers = await this.getUsers();
      const newCart = await this.cartsDao.addCart();
      const newUser = {
        ...payload,
        newCart,
      };
      const createUser = new UsersModel(newUser);
      allUsers.push(createUser);
      await this.saveUsers(allUsers);
      return newUser;
    } catch (error) {
      throw new Error(`Error saving: ${error}`);
    }
  }

  async updateUser(id, payload) {
    try {
      const allUsers = await this.getUsers();
      const userById = await this.getUserById(id);

      const newUserProperties = { ...userById, ...payload };

      const updatedUser = allUsers.map((user) => {
        if (user._id === newUserProperties._id) {
          return newUserProperties;
        } else {
          return user;
        }
      });

      await this.saveUsers(updatedUser);

      return updatedUser;
    } catch (error) {
      throw new Error(`Couldn't update the user: ${error}`);
    }
  }

  async deleteUser(id) {
    try {
      const allUsers = await this.getUsers();
      const filteredById = allUsers.filter((user) => user._id !== id);
      await this.saveUsers(filteredById);
      return `User with id: ${id} was deleted successfully`;
    } catch (error) {
      throw new Error(`Error deleting: ${error}`);
    }
  }
}

module.exports = UsersFileSystemDao;
