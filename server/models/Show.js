const mongoose = require("mongoose");

const showSchema = new mongoose.Schema({
  externalSource: String,
  externalId: String,
  title: String,
  type: String,
  genre: [String],
  releaseYear: Number,
  description: String,
  posterUrl: String,
  totalEpisodes: Number
}, { timestamps: true });

showSchema.index({ externalSource: 1, externalId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("Show", showSchema);
