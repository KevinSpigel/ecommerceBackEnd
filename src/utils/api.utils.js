const apiSuccessResponse = (payload) => {
  return {
    success: true,
    payload,
  };
};

const apiErrorResponse = (description, error = null) => {
  return {
    success: false,
    description,
    details: error,
  };
};

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

module.exports = {
  apiSuccessResponse,
  apiErrorResponse,
  HTTP_STATUS,
};
