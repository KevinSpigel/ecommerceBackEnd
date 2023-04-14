const { apiSuccessResponse, HTTP_STATUS } = require("../utils/api.utils");
const { generateProduct } = require("../utils/mocks.utils");

class MocksProductsController {
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
}

module.exports = MocksProductsController;
