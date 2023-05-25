const chai = require("chai");
const supertest = require("supertest");
const { dropProducts } = require("../../../setup.test");

const expect = chai.expect;

const requester = supertest("http://localhost:8080");

describe("Integration tests for [Products routes]", () => {
  before(async () => {
    await dropProducts();
  });

  afterEach(async () => {
    await dropProducts();
  });

  describe("Test Product routes", () => {
    it("[GET] - [api/products] - should get all products sucessfully", async () => {});
    it("[GET] - [api/products/:cid] - should get a product by id", async () => {});
    it("[POST] - [api/products] - should create a product sucessfully", async () => {});
    it("[PUT] - [api/products/:pid] - should update a product sucessfully", async () => {});
    it("[DELETE] - [api/products/:pid] - should delete a product from the DB sucessfully", async () => {});
  });
});
