const chai = require("chai");
const supertest = require("supertest");
const { SESSION_KEY, API_URL } = require("../../../../src/config/env.config");
const { DB_CONFIG } = require("../../../../src/config/db.config");

const mongoose = require("mongoose");
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

const dropUsers = async () => {
  await UsersModel.collection.drop();
};

const dropSessions = async (res) => {
  await res.clearCookie(SESSION_KEY);
};

describe("Integration tests for [Sessions routes]", () => {
  before(async () => {
    await dropUsers();
    await dropSessions();
  });

  after(async () => {
    await dropUsers();
    await dropSessions();
  });

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

  it("[GET] - [api/sessions/current] - should get the current session", async () => {
    const response = await requester.get("/api/sessions/current");

    expect(response.statusCode).to.be.equal(200);
    expect(response.body.payload.email).to.be.equal("test@gmail.com");
  });

  it("[PUT] - [api/users/premium/:uid] - should update 'user' role to 'premium' the current session", async () => {
    const user = await UsersModel.findOne({ email: "test@gmail.com" }).lean();
    const uid = user._id.toString();

    const response = await requester.put(`/api/users/premium/${uid}`);

    expect(response.statusCode).to.be.equal(200);
    expect(response.body.payload.email).to.be.equal("test@gmail.com");
    expect(response.body.payload.role).to.be.equal("premium");
  });

  it("[POST] - [api/sessions/login] - should log in the user successfully", async () => {
    await dropSessions();

    const mockLoginCredentials = {
      email: "test@gmail.com",
      password: "password",
    };

    const response = await requester
      .post("/api/sessions/login")
      .send(mockLoginCredentials);

    expect(response.statusCode).to.be.equal(200);
    expect(response.body.payload).to.be.ok;

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

  it("[GET] - [api/sessions/logout] - should delete the cookie session sucessfully", async () => {
    const response = await requester.get("/api/sessions/logout");
    expect(response.statusCode).to.be.equal(200);
    expect(response.headers).to.not.to.have.property("set-cookie");
  });
});
