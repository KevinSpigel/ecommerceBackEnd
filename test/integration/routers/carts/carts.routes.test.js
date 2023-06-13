const chai = require("chai");
const supertest = require("supertest");
const {
  dropCarts,
  dropUsers,
  dropSessions,
  dropProducts,
} = require("../../../setup.test");

const mongoose = require("mongoose");

const expect = chai.expect;

const requester = supertest("http://localhost:8080");

describe("Integration tests for [Carts routes]", () => {
  before(async () => {
    await dropCarts();
    await dropProducts();
    await dropUsers();
    await dropSessions();
  });

  after(async () => {
    await dropCarts();
    await dropProducts();
    await dropUsers();
    await dropSessions();
  });

  describe("Test Cart routes", () => {
    it("[POST] - [api/sessions/register] - should create a user 'admin' and a session successfully", async () => {
      const mockUser = {
        first_name: "John",
        last_name: "Dho",
        age: 29,
        email: "test@gmail.com",
        password: "password",
        cart: mongoose.Types.ObjectId(),
        role: "admin",
      };

      const response = await requester
        .post("/api/sessions/register")
        .send(mockUser);

      expect(response.statusCode).to.be.equal(201);
      expect(response.body.payload).to.be.ok;
      expect(response.body.payload.role).to.be.equal(mockUser.role);
    });

    it("[POST] - [api/carts] - should create a cart sucessfully", async () => {
      const response = await requester.post("/api/carts");
      expect(response.statusCode).to.be.equal(201);
      expect(response.body.payload).deep.equal([]);
      expect(response.body.payload._id).to.be.ok;
    });

    it("[GET] - [api/carts] - should get all carts sucessfully", async () => {
      const response = await requester.get("/api/carts");
      expect(response.statusCode).to.be.equal(200);
      expect(response.body).to.be.an("array");
      response.forEach((cart) => {
        expect(cart).to.be.an("object");
        expect(cart).to.have.property("_id");
      });
    });

    it("[POST] - [api/sessions/register] - should create a user 'premium' and a session successfully", async () => {
      const mockUser = {
        first_name: "David",
        last_name: "Chao",
        age: 30,
        email: "testUser@gmail.com",
        password: "password",
        cart: mongoose.Types.ObjectId(),
        role: "premium",
      };

      const response = await requester
        .post("/api/sessions/register")
        .send(mockUser);

      expect(response.statusCode).to.be.equal(201);
      expect(response.body.payload).to.be.ok;
      expect(response.body.payload.role).to.be.equal(mockUser.role);
    });

    it("[POST] - [api/carts/products/:pid] - Should return 403 avoiding 'premium' users to add their own products'", async () => {
      const createCartResponse = await requester.post("/api/carts");
      const cartId = createCartResponse.body.payload._id;
      expect(createCartResponse.statusCode).to.be.equal(201);

      const mockProduct = {
        title: "Test Product",
        description: "Test description",
        price: 10,
        product_image: "test-thumbnail",
        stock: 5,
        category: "test-category",
        owner: "testUser@gmail.com",
      };
      const createProductResponse = await requester
        .post("/api/products")
        .field("title", mockProduct.title)
        .field("description", mockProduct.description)
        .field("code", mockProduct.code)
        .field("price", mockProduct.price)
        .attach("product_image", ".test/integration/products/images/example.jpg")
        .field("stock", mockProduct.stock)
        .field("category", mockProduct.category)
        .field("status", mockProduct.status)
        .field("owner", mockProduct.owner);
      const productId = createProductResponse.body.payload._id;

      expect(createProductResponse.statusCode).to.be.equal(201);

      const addProductResponse = await requester.post(
        `/api/carts/products/${productId}`
      );

      expect(addProductResponse.statusCode).to.be.equal(403);
      expect(addProductResponse.body.description).to.be.equal(
        "Can not add own products"
      );
    });
  });
});
