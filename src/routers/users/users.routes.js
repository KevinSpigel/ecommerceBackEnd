const UsersController = require("../../controllers/users.controller");

const { BaseRouter } = require("../base.router");

class UsersRoutes extends BaseRouter {
  init() {
    this.get("/", ["admin"], UsersController.getUsers);
    this.get("/:uid", ["admin"], UsersController.getUserById);
    this.post("/", ["user", "admin"], UsersController.createUser)
    this.put("/", ["admin"], UsersController.updateUser);
  }
}

module.exports = new UsersRoutes();
