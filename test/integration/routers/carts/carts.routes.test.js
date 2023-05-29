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

    it("[POST] - [api/sessions/register] - should create a user and a session successfully", async () => {
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


    it("[POST] - [api/carts/products/:cid] - should add a product to the cart sucessfully", async () => {});

    it("[PUT] - [api/carts/products/:cid] - should update the quantity of a product in the cart sucessfully", async () => {});

    it("[DELETE] - [api/carts/products/:pid] - should delete a product from the cart sucessfully", async () => {});

  });
});
