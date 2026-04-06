const mongoose = require("mongoose");

const showSchema = new mongoose.Schema({
  title: String,
  type: String,
  genre: [String],
  releaseYear: Number,
  description: String,
  posterUrl: String,
  totalEpisodes: Number
});

module.exports = mongoose.model("Show", showSchema);
