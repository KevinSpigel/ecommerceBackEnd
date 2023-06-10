const { BaseRouter } = require("../base.router");
const uploader = require("../../utils/multer.utils");
const UsersController = require("../../controllers/users.controller");

class UsersRoutes extends BaseRouter {
  init() {
    this.get("/", ["admin"], UsersController.getUsers);
    this.get(
      "/:uid",
      ["user", "admin", "premium"],
      UsersController.getUserById
    );
    this.post(
      "/",
      ["user", "admin", "premium"],
      uploader.single("profile_image"),
      UsersController.createUser
    );
    this.put("/:uid", ["admin"], UsersController.updateUser);
    this.post(
      "/:uid/documents",
      ["user", "admin"],
      uploader.array("documents"),
      UsersController.addDocumentation
    );
    this.put("/premium/:uid", ["admin"], UsersController.changeRole);
    this.post("/resetPassword", ["PUBLIC"], UsersController.resetPasswordEmail);
    this.post("/createNewPassword", ["PUBLIC"], UsersController.setNewPassword);
    this.delete("/:uid", ["admin"], UsersController.deleteUser);
    this.delete("/", ["admin"], UsersController.deleteAllInactiveUsers);
  }
}

module.exports = new UsersRoutes();
