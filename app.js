const express = require("express");
const bodyParser = require("body-parser");
require("./config/config");

const mongoose = require("./db/mongoose");
const { ObjectID } = require("mongodb");
const { User } = require("./models/user");
const { Quote } = require("./models/quote");
const { authenticate } = require("./middleware/auth");
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
  const id = req.params.id;
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
  const id = req.params.id;
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

app.patch("/quotes/:id", (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send({
      message: "not found"
    });
  }
  const { text, author, year } = req.body;

  Quote.findByIdAndUpdate(
    id,
    {
      $set: {
        author,
        text,
        year
      }
    },
    { new: true }
  )
    .then(quote => {
      return res.send({ quote });
    })
    .catch(err => res.status(400).send());
});

app.post("/users", (req, res) => {
  const { email, password } = req.body;
  const newUser = new User({ email, password });
  newUser
    .save()
    .then(user => {
      return user.generateAuthToken();
    })
    .then(token => {
      res.header("x-auth", token).send(newUser);
    })
    .catch(err => {
      res.status(400).send({ error: err });
    });
});

app.get("/users/me", authenticate, (req, res) => {
  res.send({ user: req.user });
});

app.post("/users/login", (req, res) => {
  const { email, password } = req.body;
  User.findByCredentials(email, password)
    .then(user => {
      if (user.tokens[0].token) {
        return res.header("x-auth", user.tokens[0].token).send({ user });
      }
      user.generateAuthToken().then(token => {
        res.header("x-auth", token).send({ user });
      });
    })
    .catch(err => res.status(400).send());
});

app.delete("/users/logout", authenticate, (req, res) => {
  req.user
    .deleteToken(req.token)
    .then(() => {
      res.status(200).send();
    })
    .catch(err => res.status.send(400));
});

module.exports = app;
