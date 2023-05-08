const { BaseRouter } = require("../base.router");
const UsersController = require("../../controllers/users.controller");

class UsersRoutes extends BaseRouter {
  init() {
    this.get("/", ["admin"], UsersController.getUsers);
    this.get(
      "/:uid",
      ["user", "admin", "premium"],
      UsersController.getUserById
    );
    this.post("/", ["user", "admin"], UsersController.createUser);
    this.put("/:uid", ["admin"], UsersController.updateUser);
    this.put("premium/:uid", ["admin"], UsersController.changeRole);
    this.delete("/:uid", ["admin"], UsersController.deleteUser);
  }
}

module.exports = new UsersRoutes();
