const chai = require("chai");
const supertest = require("supertest");
const { dropProducts, dropSessions } = require("../../../setup.test");

const expect = chai.expect;

const requester = supertest("http://localhost:8080");

describe("Integration tests for [Products routes]", () => {
  before(async () => {
    await dropProducts();
    await dropSessions();
  });

  after(async () => {
    await dropProducts();
    await dropSessions();
  });

  describe("Test Products routes [ROLE => 'user']", () => {
    // EL USUARIO DEBE ESTAR LOGGEADO PARA PODER VER TODOS LOS PRODUCTOS

    it("[GET] - [api/products] - should get all products sucessfully", async () => {
      const response = await requester.get("/api/products");
      expect(result).to.be.an("array");
    });

    it("[GET] - [api/products/:cid] - should get a product by id", async () => {});
  });

  describe("Test Products routes [ROLE => 'admin' or 'premium']", () => {
    //EL USUARIO DEBE SER ADMIN O PREMIUM PARA CREAR PRODUCTO POR LO QUE DEBE REGISTRARSE UN ADMIN.

    it("[POST] - [api/products] - should create a product sucessfully", async () => {
      const mockProduct = {
        title: "Mock Product",
        description: "a product to make tests",
        code: "abc123",
        price: 10,
        stock: 5,
        category: "tests",
        status: true,
        role: "admin",
      };

      const response = await requester
        .post("/api/products")
        .field("title", mockProduct.title)
        .field("description", mockProduct.description)
        .field("code", mockProduct.code)
        .field("price", mockProduct.price)
        .attach("thumbnail", ".test/integration/products/images/example.jpg")
        .field("stock", mockProduct.stock)
        .field("category", mockProduct.category)
        .field("status", mockProduct.status)
        .field("role", mockProduct.role);

      expect(response.statusCode).to.be.equal(201);
      expect(response.body.payload).to.be.ok;
      expect(response.body.payload).to.have.property("_id");
      expect(response.body.payload.thumbnail).to.be.ok;
      expect(response.body.payload.role).to.be.equal(mockProduct.role);
    });

    it("[PUT] - [api/products/:pid] - should update a product sucessfully", async () => {});

    it("[DELETE] - [api/products/:pid] - should delete a product from the DB sucessfully", async () => {});
  });
});
