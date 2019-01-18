const { ObjectID } = require("mongodb");
const { Quote } = require("../models/quote");
const getLongestWord = require("../utils/getLongestWord");
const queryBuilder = require("../utils/queryBuilder");

const createOne = async (req, res) => {
  const { author, text, year } = req.body;
  // sanitize and validate input
  const newQuote = new Quote({
    author,
    text,
    year,
    postedBy: req.user._id
  });

  try {
    const quote = await newQuote.save();
    res.status(201).json({ quote });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

const getAll = async (req, res) => {
  let query = {};
  if(req.query.search){
    query = { $text: { $search: req.query.search } };
  } else {
    query = queryBuilder(req);
  }

  try {
    const quotes = await Quote.find(query).exec();
    res.status(200).json({ quotes });
  } catch (e) {
    res
      .status(500)
      .json({ error: "error occurred while retrieving the quotes" });
  }
};

const deleteQuote = async (req, res) => {
  let query = queryBuilder(req);
  query = { ...query}
  const queries = Object.keys(query);
  if(!queries.length) return res.status(400).json({message: "Not allowed"});
  try{
    const quotes = await Quote.deleteMany({ ...query}).exec();
    res.status(200).send({ message: "Quotes deleted successfully" });
  }catch(err){
    console.log(err);
  }
}

const getOne = async (req, res) => {
  const id = req.params.id;
  try {
    const quote = await Quote.findOne({
      _id: id,
      postedBy: req.user._id
    }).exec();
    const longestWord = getLongestWord(quote.text);
    if (!quote) throw new Error("not found");
    res.status(200).json({ quote, longestWord, longestWordLength: longestWord.length  });
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};

updateOne = async (req, res) => {
  const id = req.params.id;
  const { text, author, year } = req.body;

  try {
    const quote = await Quote.findOneAndUpdate(
      { _id: id, postedBy: req.user._id },
      {
        $set: {
          author,
          text,
          year
        }
      },
      { new: true }
    ).exec();
    if (!quote) throw new Error("not found");
    res.status(200).json({ quote });
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};

deleteOne = async (req, res) => {
  const id = req.params.id;
  try {
    const quote = await Quote.findOneAndDelete({
      _id: id,
      postedBy: req.user._id
    }).exec();
    if (!quote) throw new Error("not found");
    res.status(200).json({ quote });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

module.exports = {
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne,
  deleteQuote,
};
