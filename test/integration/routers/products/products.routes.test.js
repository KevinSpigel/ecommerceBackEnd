const chai = require("chai");
const supertest = require("supertest");

const mongoose = require("mongoose");

const { SESSION_KEY, API_URL } = require("../../../../src/config/env.config");

const { DB_CONFIG } = require("../../../../src/config/db.config");
const {
  ProductsModel,
} = require("../../../../src/models/schemas/products.schema");
const { UsersModel } = require("../../../../src/models/schemas/users.schema");

const expect = chai.expect;

const requester = supertest(`http://${API_URL}`);

before(function () {
  this.timeout(10000);
  mongoose.set("strictQuery", true);
  mongoose.connect(DB_CONFIG.mongoDb.uri);
});

after(() => {
  mongoose.connection.close();
});

const dropProducts = async () => {
  await ProductsModel.collection.drop();
};

const dropUsers = async () => {
  await UsersModel.collection.drop();
};

const dropSessions = async (res) => {
  await res.clearCookie(SESSION_KEY);
};

describe("Integration Test Products routes [Unanthenticated and Unauthorized users]", () => {
  before(async () => {
    await dropProducts();
    await dropSessions();
    await dropUsers();
  });

  after(async () => {
    await dropProducts();
    await dropSessions();
    await dropUsers();
  });

  it("[GET] - [api/products] - should return a code 401 for Unauthenticated users", async () => {
    const response = await requester.get("/api/products");
    expect(response.statusCode).to.be.equal(401);
  });

  it("[POST] - [api/products] - should return a code 403 for Unauthorized users", async () => {
    const mockUser = {
      first_name: "John",
      last_name: "Dho",
      age: 29,
      email: "test@gmail.com",
      password: "password",
      cart: mongoose.Types.ObjectId(),
      role: "user",
    };

    const result = await requester
      .post("/api/sessions/register")
      .send(mockUser);

    expect(result.statusCode).to.be.equal(201);
    expect(result.body.payload).to.be.ok;
    expect(result.body.payload.role).to.be.equal(mockUser.role);

    const mockProduct = {
      title: "Mock Product",
      description: "a product to make tests",
      code: "abc123",
      price: 10,
      stock: 5,
      category: "tests",
      status: true,
    };

    const response = await requester
      .post("/api/products")
      .field("title", mockProduct.title)
      .field("description", mockProduct.description)
      .field("code", mockProduct.code)
      .field("price", mockProduct.price)
      .attach("product_image", ".test/integration/products/images/example.jpg")
      .field("stock", mockProduct.stock)
      .field("category", mockProduct.category)
      .field("status", mockProduct.status)
      .field("role", mockProduct.role);

    expect(response.statusCode).to.be.equal(403);
  });
});

describe("Integration Test Products routes [ROLE => 'user']", () => {
  let cookie;

  it("[POST] - [api/sessions/register] - should create a user and a session successfully", async () => {
    const mockUser = {
      first_name: "John",
      last_name: "Dho",
      age: 29,
      email: "test@gmail.com",
      password: "password",
      cart: mongoose.Types.ObjectId(),
      role: "user",
    };

    const response = await requester
      .post("/api/sessions/register")
      .send(mockUser);

    expect(response.statusCode).to.be.equal(201);
    expect(response.body.payload).to.be.ok;
    expect(response.body.payload.role).to.be.equal(mockUser.role);

    // check if cookie was set successfully

    const cookieHeader = response.headers["set-cookie"][0];
    expect(cookieHeader).to.be.ok;

    cookie = {
      name: cookieHeader.split("=")[0],
      value: cookieHeader.split("=")[1],
    };

    expect(cookie.name).to.be.equal(SESSION_KEY);
    expect(cookie.value).to.be.ok;
  });

  it("[GET] - [api/products] - should get all products sucessfully", async () => {
    const response = await requester.get("/api/products");
    expect(response.statusCode).to.be.equal(200);
    expect(response.body).to.be.an("object");
    expect(response.body.payload).to.be.an("array");
  });

  it("[GET] - [api/products] - should get all products by using filters sucessfully", async () => {
    const limit = 10;
    const page = 1;
    const query = "category";
    const sort = "asc";

    const response = await requester
      .get("/api/products")
      .query({ limit, page });
    expect(response.statusCode).to.be.equal(200);
    expect(response.body).to.be.an("object");
    expect(response.body.payload).to.be.an("array");
  });
});

describe("Test Products routes [ROLE => 'admin' or 'premium']", () => {
  let cookie;

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

    // check if cookie was set successfully

    const cookieHeader = response.headers["set-cookie"][0];
    expect(cookieHeader).to.be.ok;

    cookie = {
      name: cookieHeader.split("=")[0],
      value: cookieHeader.split("=")[1],
    };

    expect(cookie.name).to.be.equal(SESSION_KEY);
    expect(cookie.value).to.be.ok;
  });

  it("[POST] - [api/products] - should create a product sucessfully", async () => {
    const mockProduct = {
      title: "Mock Product",
      description: "a product to make tests",
      code: "abc123",
      price: 10,
      stock: 5,
      category: "tests",
      status: true,
      owner: "admin",
    };

    const response = await requester
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

    expect(response.statusCode).to.be.equal(201);
    expect(response.body.payload).to.be.ok;
    expect(response.body.payload).to.have.property("_id");
    expect(response.body.payload.product_image).to.be.ok;
    expect(response.body.payload.role).to.be.equal(mockProduct.role);
  });

  it("[DELETE] - [api/products/:pid] - should delete a product by their id sucessfully", async () => {
    const product = await ProductsModel.findOne({ code: "abc123" }).lean();
    const pid = product._id.toString();

    const response = await requester.delete(`/api/products/${pid}`);
    const deletedProduct = await ProductsModel.findOne({
      code: "abc123",
    }).lean();

    expect(response.statusCode).to.be.equal(200);
    expect(deletedProduct).to.be.equal(null);
  });
});
