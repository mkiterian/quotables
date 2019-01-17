const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    trim: true
  },
  author: {
    type: String,
    maxlength: 64,
    default: "Anonymous"
  },
  year: {
    type: Number
  },
  postedBy: {
    type: mongoose.Types.ObjectId,
    required: true
  }
});

quoteSchema.index({ text: "text" });

const Quote = mongoose.model("Quote", quoteSchema);

module.exports = { Quote };
