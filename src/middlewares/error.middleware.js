const { HTTP_STATUS } = require("../constants/api.constants");
const { apiErrorResponse } = require("../utils/api.utils");

const errorMiddleware = (error, req, res, next) => {
  const response = apiErrorResponse(
    error.description || error.message,
    error.details || error
  );
  return res.status(error.status || HTTP_STATUS.SERVER_ERROR).json(response);
};

module.exports = {
  errorMiddleware,
};
