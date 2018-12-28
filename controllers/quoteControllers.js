const { ObjectID } = require("mongodb");
const { Quote } = require("../models/quote");

const createOne = (req, res) => {
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
};

const getAll = (req, res) => {
  Quote.find({ postedBy: req.user._id }).then(
    quotes => {
      return res.send({ quotes });
    },
    err => {
      return res.status(400).send(err);
    }
  );
};

const getOne = (req, res) => {
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
};

updateOne = (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send({
      message: "not found"
    });
  }
  const { text, author, year } = req.body;

  Quote.findOneAndUpdate(
    { _id: id, postedBy: req.user._id },
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
};

deleteOne = (req, res) => {
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
};

module.exports = {
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne
};
