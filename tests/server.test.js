const request = require("supertest");
const mongoose = require("mongoose");
const { Quote } = require("../models/quote");
const app = require("../app");

const testQuote = {
  text: "This is a test quote",
  year: 2000
};

const testQuotes = [
  {
    text: "test quote 1"
  },
  {
    text: "test quote 2",
    author: "testAuthor1"
  },
  {
    text: "test quote 3",
    author: "testAuthor3",
    year: 2018
  }
];

beforeEach(done => {
  Quote.deleteMany({})
    .then(() => {
      return Quote.insertMany(testQuotes);
    })
    .then(() => {
      return done();
    });
});

afterAll(done => {
  mongoose.disconnect(done);
});

describe("POST /quotes", () => {
  test("should create a new quote", async () => {
    const response = await request(app)
      .post("/quotes")
      .send({ ...testQuote });
    expect(response.statusCode).toBe(201);
    expect(response.body.text).toBe(testQuote.text);
  });

  test("should not create a new quote without text", async () => {
    const response = await request(app)
      .post("/quotes")
      .send({ ...testQuote, text: undefined });
    expect(response.statusCode).toBe(400);
  });
});

describe("GET /quotes", () => {
  test("should get all quotes", async () => {
    const response = await request(app).get("/quotes");
    expect(response.statusCode).toBe(200);
    expect(response.body.quotes.length).toBe(testQuotes.length);
  });
});

describe("GET /quotes/:id", () => {
  test("should get a quote with a given id", async () => {
    const allTestQuotes = await request(app).get("/quotes");
    const id = allTestQuotes.body.quotes[0]._id;
    const response = await request(app).get(`/quotes/${id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.quote.text).toBe(testQuotes[0].text);
  });

  test("should return a 404 if a quote is not found", async () => {
    const allTestQuotes = await request(app).get("/quotes");
    let id = allTestQuotes.body.quotes[0]._id;
    id = id.substring(0, 5);
    const response = await request(app).get(`/quotes/${id}`);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("not found");
  });
});

describe("DELETE /quotes/:id", () => {
  test("should delete a quote with a given id", async () => {
    const allTestQuotes = await request(app).get("/quotes");
    const id = allTestQuotes.body.quotes[0]._id;
    const response = await request(app).delete(`/quotes/${id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.quote.text).toBe(testQuotes[0].text);
    const newResponse = await request(app).get("/quotes");
    expect(newResponse.body.quotes.length).toBe(testQuotes.length - 1);
  });
});
