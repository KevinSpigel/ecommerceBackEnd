const {
  apiSuccessResponse,
  HTTP_STATUS,
  HttpError,
} = require("../utils/api.utils");
const { PORT } = require("../config/env.config");

const { getDAOS } = require("../models/daos/daosFactory");
const productsRepository = require("../models/repositories/products.repository");

const { productsDao } = getDAOS();

class ProductsController {
  //CREATE new product
  static async addProduct(req, res, next) {
    try {
      const addNewProduct = req.body;
      const socket = req.app.get("socket");
      const filename = req.file.filename;

      const newProduct = await productsDao.addProduct(
        addNewProduct.title,
        addNewProduct.description,
        addNewProduct.code,
        +addNewProduct.price,
        (addNewProduct.thumbnail = filename),
        +addNewProduct.stock,
        addNewProduct.category,
        addNewProduct.status
      );
      socket.emit("newProduct", newProduct);
      const response = apiSuccessResponse(newProduct);
      return res.status(HTTP_STATUS.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  }

  //GET all products + query param + paginate

  static async getProducts(req, res, next) {
    try {
      const products = await productsDao.getProducts(req.query);
      const data = {
        status: "success",
        payload: products.doc,
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        nextLink: products.hasNextPage
          ? `http://localhost:${PORT}${req.baseUrl}/?limit=${limit}&page=${payload.nextPage}`
          : null,
        prevLink: products.hasPrevPage
          ? `http://localhost:${PORT}${req.baseUrl}/?page=/${payload.prevPage}`
          : null,
      };

      const response = apiSuccessResponse(data);
      return res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  //GET product by id
  static async getProductById(req, res, next) {
    const pid = req.params.pid;
    try {
      const result = await productsRepository.getProductById(pid);
      const response = apiSuccessResponse(result);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  //UPDATE product by id

  static async updateProduct(req, res, next) {
    const pid = req.params.pid;
    const product = req.body;
    try {
      const result = await productsRepository.updateProductById(pid, product);
      const response = apiSuccessResponse(result);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  //DELETE product by id

  static async deleteProduct(req, res, next) {
    const pid = req.params.pid;
    try {
      const result = await productsRepository.deleteProductById(pid);
      const response = apiSuccessResponse(result);
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductsController;
