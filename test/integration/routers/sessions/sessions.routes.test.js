const chai = require("chai");
const supertest = require("supertest");
const { SESSION_KEY } = require("../../../../src/config/env.config");
const { dropUsers, dropSessions } = require("../../../setup.test");

const mongoose = require("mongoose");

const expect = chai.expect;

const requester = supertest("http://localhost:8080");

describe("Integration tests for [Sessions routes]", () => {
  describe("Test Sessions routes", () => {
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
        role: "admin",
      };

      const response = await requester
        .post("/api/sessions/register")
        .send(mockUser);

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

    it("[GET] - [api/sessions/current] - should get the current session", async () => {
      const response = await requester.get("/api/sessions/current");

      expect(response.statusCode).to.be.equal(200);
      expect(response.body.payload.email).to.be.equal("test@gmail.com");
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
});
