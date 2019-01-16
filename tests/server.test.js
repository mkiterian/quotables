const request = require("supertest");
const mongoose = require("mongoose");
const { User } = require("../models/user");
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
      .set("x-auth", testUsers[0].tokens[0].token)
      .send({ ...testQuote });
    expect(response.statusCode).toBe(201);
    expect(response.body.quote.text).toBe(testQuote.text);
  });

  test("should not create a new quote without text", async () => {
    const response = await request(app)
      .post("/quotes")
      .set("x-auth", testUsers[0].tokens[0].token)
      .send({ ...testQuote, text: undefined });
    expect(response.statusCode).toBe(400);
  });
});

describe("GET /quotes", () => {
  test("should get all quotes", async () => {
    const response = await request(app)
      .get("/quotes")
      .set("x-auth", testUsers[0].tokens[0].token);
    expect(response.statusCode).toBe(200);
    expect(response.body.quotes.length).toBe(3);
  });
});

describe("GET /quotes/:id", () => {
  test("should get a quote with a given id", async () => {
    const id = testQuotes[0]._id;
    const response = await request(app)
      .get(`/quotes/${id}`)
      .set("x-auth", testUsers[0].tokens[0].token);
    expect(response.statusCode).toBe(200);
    expect(response.body.quote.text).toBe(testQuotes[0].text);
  });

  test("should return a 404 if a quote is not found", async () => {
    id = "random";
    const response = await request(app)
      .get(`/quotes/${id}`)
      .set("x-auth", testUsers[0].tokens[0].token);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("not found");
  });

  test("should not get a quote created by another user", async () => {
    const id = testQuotes[0]._id;
    const response = await request(app)
      .get(`/quotes/${id}`)
      .set("x-auth", testUsers[1].tokens[0].token);
    expect(response.statusCode).toBe(404);
  });
});

describe("DELETE /quotes/:id", () => {
  test("should delete a quote with a given id", async () => {
    const id = testQuotes[0]._id;
    const response = await request(app)
      .delete(`/quotes/${id}`)
      .set("x-auth", testUsers[0].tokens[0].token);
    expect(response.statusCode).toBe(200);
    expect(response.body.quote.text).toBe(testQuotes[0].text);
  });

  test("should return a 404 if id is not found", async () => {
    const id = "123";
    const response = await request(app)
      .delete(`/quotes/${id}`)
      .set("x-auth", testUsers[0].tokens[0].token);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("not found");
  });
});

describe("PATCH /quotes/:id", () => {
  test("should update a quote with a given id", async () => {
    const updateText = "This is an update";
    const id = testQuotes[0]._id;
    const response = await request(app)
      .patch(`/quotes/${id}`)
      .set("x-auth", testUsers[0].tokens[0].token)
      .send({
        text: updateText
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.quote.text).toBe(updateText);
  });

  test("should return a 404 if id is not found", async () => {
    const id = "123";
    const response = await request(app)
      .patch(`/quotes/${id}`)
      .set("x-auth", testUsers[0].tokens[0].token);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("not found");
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
    expect(response.body.errors.email).toBe(`${email} is not a valid email address`);
  });

  it("should return correct error if email is already taken", async () => {
    const email = testUsers[0].email;
    const password = "qwertyuiop";
    const response = await request(app)
      .post("/users")
      .send({ email, password });
    expect(response.body.message).toBe("Email address already in use");
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

describe("POST /users/login", () => {
  it("should login user and return auth token", async () => {
    const response = await request(app)
      .post("/users/login")
      .send({
        email: testUsers[0].email,
        password: testUsers[0].password
      });
    expect(response.headers["x-auth"]).toBeTruthy();
    expect(response.body.user.email).toBe(testUsers[0].email);
  });

  it("should fail login", async () => {
    const response = await request(app)
      .post("/users/login")
      .send({
        email: testUsers[0].email,
        password: "wrong"
      });
    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe("there was an error logging in");
    expect(response.headers["x-auth"]).toBeUndefined();
  });
});

describe("DELETE /users/logout", () => {
  it("should logout user successfully", async () => {
    const response = await request(app)
      .delete("/users/logout")
      .set("x-auth", testUsers[0].tokens[0].token);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Successfully logged out");
    const result = await User.findById(testUsers[0]);
    expect(result.tokens.length).toBe(0);

    const loginResponse = await request(app)
      .post("/users/login")
      .send({
        email: testUsers[0].email,
        password: testUsers[0].password
      });
    expect(loginResponse.headers["x-auth"]).toBeTruthy();
    expect(loginResponse.body.user.email).toBe(testUsers[0].email);
  });
});
