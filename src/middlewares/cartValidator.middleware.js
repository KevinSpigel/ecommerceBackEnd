const { HTTP_STATUS } = require("../constants/api.constants");
const { userModel } = require("../models/schemas/users.model");
const { apiErrorResponse } = require("../utils/api.utils");

const cartValidatorMiddleware = async (req, res, next) => {
  const user = req.user;

  if (user.role == "admin") {
    return next();
  }

  const userDb = await userModel.find({ email: user.email }).lean();

  if (user.cart._id == userDb[0].cart._id) {
    next();
  } else {
    const response = apiErrorResponse("Access denied");
    return res.status(HTTP_STATUS.FORBIDDEN).json(response);
  }
};

module.exports = {
  cartValidatorMiddleware,
};
