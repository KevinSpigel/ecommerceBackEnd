const chai = require("chai");
const supertest = require("supertest");
const { dropCarts } = require("../../../setup.test");

const expect = chai.expect;

const requester = supertest("http://localhost:8080");

describe("Integration tests for [Carts routes]", () => {
  before(async () => {
    await dropCarts();
  });

  afterEach(async () => {
    await dropCarts();
  });
  describe("Test Cart routes", () => {
    it("[GET] - [api/carts] - should get all carts sucessfully", async () => {
      const response = await requester.get("/api/carts");
      expect(response.body).to.be.an("array");
      response.forEach((cart) => {
        expect(cart).to.be.an("object")
        expect(cart).to.have.property("_id");
      });
      expect(response.statusCode).to.be.equal(200);
    });

    it("[GET] - [api/carts/:cid] - should get a cart by id sucessfully", async () => {});

    it("[POST] - [api/carts] - should create a cart sucessfully", async () => {
      const response = await requester.post("/api/carts");
      expect(response).deep.equal([]);
      expect(response).to.have.property("_id");
      expect(response.statusCode).to.be.equal(201);
    });

    it("[POST] - [api/carts/products/:cid] - should add a product to the cart sucessfully", async () => {});

    it("[PUT] - [api/carts/products/:cid] - should update the quantity of a product in the cart sucessfully", async () => {});

    it("[POST] - [api/carts/:cid/purchase] - should allow purchase", async () => {

    });

    it("[DELETE] - [api/carts/products/:pid] - should delete a product from the cart sucessfully", async () => {});

    it("[DELETE] - [api/carts/:cid] - should delete a cart sucessfully", async () => {});
  });
});
