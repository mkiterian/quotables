const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const {
  testQuote,
  testQuotes,
  seedQuotes,
  testUsers,
  seedUsers
} = require("./seed/seed");

beforeEach(seedUsers);
beforeEach(seedQuotes);

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

  test("should return a 404 if id is not found", async () => {
    const allTestQuotes = await request(app).get("/quotes");
    const id = "123";
    const response = await request(app).delete(`/quotes/${id}`);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("not found");
  });
});

describe("PATCH /quotes/:id", () => {
  test("should update a quote with a given id", async () => {
    const updateText = "This is an update";
    const allTestQuotes = await request(app).get("/quotes");
    const id = allTestQuotes.body.quotes[0]._id;
    const response = await request(app)
      .patch(`/quotes/${id}`)
      .send({
        text: updateText
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.quote.text).toBe(updateText);
  });

  test("should return a 404 if id is not found", async () => {
    const id = "123";
    const response = await request(app).patch(`/quotes/${id}`);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("not found");
  });
});

describe("GET /users/me", () => {
  it("should return a user if authenticated", async () => {
    const response = await request(app)
      .get("/users/me")
      .set("x-auth", testUsers[0].tokens[0].token);
    expect(response.statusCode).toBe(200);
    expect(response.body.user.email).toBe(testUsers[0].email);
    expect(response.body.user._id).toBe(testUsers[0]._id.toString());
  });

  it("should return a 401 if not authenticated", async () => {
    const response = await request(app).get("/users/me");
    expect(response.statusCode).toBe(401);
  });
});

describe("POST /users", () => {
  it("shoud create a user", async () => {
    const email = "qwerty@email.com";
    const password = "qwertyuiop";
    const response = await request(app)
      .post("/users")
      .send({ email, password });
    expect(response.statusCode).toBe(200);
    expect(response.body.email).toBe(email);
    expect(response.headers["x-auth"]).not.toBeUndefined();
  });
  it("should return validation errors if request is invalid", async () => {
    const email = "email.com";
    const password = "qwertyuiop";
    const response = await request(app)
      .post("/users")
      .send({ email, password });
    expect(response.statusCode).toBe(400);
  });
  it("should not create user if the email is in use", async () => {
    const email = testUsers[0].email;
    const password = "qwertyuiop";
    const response = await request(app)
      .post("/users")
      .send({ email, password });
    expect(response.statusCode).toBe(400);
  });
});
