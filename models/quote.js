const mongoose = require("mongoose");

const Quote = mongoose.model("Quote", {
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
  }
});

module.exports = { Quote };
