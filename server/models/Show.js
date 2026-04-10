const mongoose = require("mongoose");

const showSchema = new mongoose.Schema({
  tvmazeId: {
    type: Number,
    unique: true,
    sparse: true
  },
  title: String,
  type: String,
  genre: [String],
  releaseYear: Number,
  description: String,
  posterUrl: String,
  rating: Number,
  externalUrl: String
});

module.exports = mongoose.model("Show", showSchema);
