const mongoose = require("../db/mongoose");
const { User } = require("../models/user");

const createUser = (req, res) => {
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
};

const login = (req, res) => {
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
};

const logout = (req, res) => {
  req.user
    .deleteToken(req.token)
    .then(() => {
      res.status(200).send();
    })
    .catch(err => res.status.send(400));
};

module.exports = {
  createUser,
  login,
  logout,
};
