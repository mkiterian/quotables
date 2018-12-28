const express = require("express");
const router = express.Router();
const mongoose = require("../db/mongoose");
const { ObjectID } = require("mongodb");
const { User } = require("../models/user");
const { Quote } = require("../models/quote");
const { authenticate } = require("../middleware/auth");

router.post("/quotes", authenticate, (req, res) => {
  const { author, text, year } = req.body;
  const newQuote = new Quote({
    author,
    text,
    year,
    postedBy: req.user._id
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

router.get("/quotes", authenticate, (req, res) => {
  Quote.find({ postedBy: req.user._id }).then(
    quotes => {
      return res.send({ quotes });
    },
    err => {
      return res.status(400).send(err);
    }
  );
});

router.get("/quotes/:id", authenticate, (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send({
      message: "not found"
    });
  }
  Quote.findOne({ _id: id, postedBy: req.user._id }).then(
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

router.delete("/quotes/:id", authenticate, (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send({
      message: "not found"
    });
  }
  Quote.findOneAndDelete({ _id: id, postedBy: req.user._id }).then(
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

router.patch("/quotes/:id", authenticate, (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send({
      message: "not found"
    });
  }
  const { text, author, year } = req.body;

  Quote.findOneAndUpdate(
    {_id: id, postedBy:req.user._id},
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

router.post("/users", (req, res) => {
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

router.get("/users/me", authenticate, (req, res) => {
  res.send({ user: req.user });
});

router.post("/users/login", (req, res) => {
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

router.delete("/users/logout", authenticate, (req, res) => {
  req.user
    .deleteToken(req.token)
    .then(() => {
      res.status(200).send();
    })
    .catch(err => res.status.send(400));
});

module.exports = router;

