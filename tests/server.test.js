const request = require("supertest");
const mongoose = require("mongoose");
const { Quote } = require("../models/quote");
const app = require("../app");

const testQuote = {
  text: "This is a test quote",
  year: 2000
};

describe("POST /quotes", () => {
  beforeEach(done => {
    Quote.deleteMany({}).then(() => done());
  });

  afterAll(done => {
    mongoose.disconnect(done);
  });

  test("should create a new quote", async () => {
    const response = await request(app)
      .post("/quotes")
      .send({ ...testQuote });

    expect(response.statusCode).toBe(200);
  });

  test("should not create a new quote without text", async () => {
    const response = await request(app)
      .post("/quotes")
      .send({ ...testQuote, text: undefined });

    expect(response.statusCode).toBe(400);
  });
});
