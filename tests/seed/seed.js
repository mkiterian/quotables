const { ObjectID } = require("mongodb");
const jwt = require("jsonwebtoken");

const { Quote } = require("../../models/quote");
const { User } = require("../../models/user");

const testQuote = {
  text: "This is a test quote",
  year: 2000
};

const testUser1Id = ObjectID();
const testUser2Id = ObjectID();

const testQuotes = [
  {
    _id: new ObjectID(),
    text: "test quote 1",
    postedBy: testUser1Id,
  },
  {
    _id: new ObjectID(),
    text: "test quote 2",
    author: "testAuthor1",
    postedBy: testUser1Id,
  },
  {
    _id: new ObjectID(),
    text: "test quote 3",
    author: "testAuthor3",
    year: 2018,
    postedBy: testUser2Id,
  }
];

const testUsers = [
  {
    _id: testUser1Id,
    email: "testUser1@email.com",
    password: "password123",
    tokens: [
      {
        access: "auth",
        token: jwt
          .sign({ _id: testUser1Id, access: "auth" }, "secret123")
          .toString()
      }
    ]
  },
  {
    _id: testUser2Id,
    email: "testUser2@email.com",
    password: "password123",
    tokens: [
      {
        access: "auth",
        token: jwt
          .sign({ _id: testUser2Id, access: "auth" }, "secret123")
          .toString()
      }
    ]
  }
];

const seedQuotes = done => {
  Quote.deleteMany({})
    .then(() => {
      return Quote.insertMany(testQuotes);
    })
    .then(() => {
      return done();
    });
};

const seedUsers = done => {
  User.deleteMany({})
    .then(() => {
      const testUser1 = new User(testUsers[0]).save();
      const testUser2 = new User(testUsers[1]).save();

      return Promise.all([testUser1, testUser2]);
    })
    .then(() => done());
};

module.exports = {
  testQuote,
  testQuotes,
  seedQuotes,
  testUsers,
  seedUsers,
};
