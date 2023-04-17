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

// const { MongoClient } = require("mongodb");
// const { MONGO_URI } = require("../config/env.config");
// const { Product } = require("../models/product.model");
// const { products } = require("./products.data");

// async function generateProducts() {
//   const client = new MongoClient(MONGO_URI);
//   try {
//     await client.connect();
//     const database = client.db();
//     const productsCollection = database.collection("products");
//     const formattedProducts = products.map((product) => new Product(product));
//     await productsCollection.insertMany(formattedProducts);
//     console.log("Products generated successfully");
//   } catch (error) {
//     console.error(error);
//   } finally {
//     await client.close();
//   }
// }
