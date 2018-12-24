const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("./db/mongoose");
const { ObjectID } = require("mongodb");
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
      return res.status(201).send(quote);
    },
    err => {
      return res.status(400).send(err);
    }
  );
});

app.get("/quotes", (req, res) => {
  Quote.find().then(
    quotes => {
      return res.send({ quotes });
    },
    err => {
      return res.status(400).send(err);
    }
  );
});

app.get("/quotes/:id", (req, res) => {
  id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send({
      message: "not found"
    });
  }
  Quote.findById(id).then(
    quote => {
      if (!quote) {
        return res.status(404).send({
          message: "not found"
        });
      }
      return res.send({ quote });
    },
    err => {
      return res.status(404).send({});
    }
  );
});

app.delete("/quotes/:id", (req, res) => {
  id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send({
      message: "not found"
    });
  }
  Quote.findByIdAndDelete(id).then(
    quote => {
      if (!quote) {
        return res.status(404).send({
          message: "not found"
        });
      }
      return res.send({ quote });
    },
    err => {
      return res.status(404).send({});
    }
  );
});

module.exports = app;
