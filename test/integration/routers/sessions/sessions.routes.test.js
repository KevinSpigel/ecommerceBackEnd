const chai = require("chai");
const supertest = require("supertest");
const { dropUsers } = require("../../../setup.test");
const { afterEach } = require("mocha");

const expect = chai.expect;

const requester = supertest("http://localhost:8080");

describe("Integration tests for [Sessions routes]", () => {
  before(async () => {
    await dropUsers();
  });

  afterEach(async () => {
    await dropUsers();
  });

  describe("Test Session routes", () => {
    it("[POST] - [api/sessions/register] - should create a user and a session sucessfully", async () => {});
    it("[GET] - [api/sessions/login] - should log in the user sucessfully", async () => {});
    it("[GET] - [api/sessions/current] - should get the current user logued", async () => {});
    it("[GET] - [api/sessions/logout] - should delete the cookie session sucessfully", async () => {});
  });
});
