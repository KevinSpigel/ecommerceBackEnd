const { apiSuccessResponse, HTTP_STATUS } = require("../utils/api.utils");
const { generateProduct, generateUser } = require("../utils/mocks.utils");

class MocksController {
  //CREATE mock products
  static async generateMockProducts(req, res, next) {
    const total = +req.query.total || 100;
    try {
      let result = Array.from({ length: total }, () => generateProduct());
      const response = apiSuccessResponse(result);
      res.status(HTTP_STATUS.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async generateMockUsers(req, res, next) {
    const total = +req.query.total || 30;
    try {
      let result = Array.from({ length: total }, () => generateUser());
      const response = apiSuccessResponse(result);
      res.status(HTTP_STATUS.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MocksController;
