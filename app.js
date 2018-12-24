const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("./db/mongoose");
const { User } = require("./models/user");
const { Quote } = require("./models/quote");
const app = express();
app.use(bodyParser.json());

app.post("/quotes", (req, res) => {
  const { author, text, year } = req.body;
  const newQuote = new Quote({
    author,
    text,
    year
  });

  newQuote.save().then(
    quote => {
      res.send(quote);
    },
    err => {
      res.status(400).send(err);
    }
  );
});

app.get("/quotes", (req, res) => {
  Quote.find().then(
    quotes => {
      res.send({ quotes });
    },
    err => {
      res.status(400).send(err);
    }
  );
});

module.exports = app;
