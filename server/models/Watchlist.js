const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  showId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Show"
  },
  status: String,
  progress: Number,
  addedAt: {
    type: Date,
    default: Date.now
  }
});

watchlistSchema.index({ userId: 1, showId: 1 }, { unique: true });

module.exports = mongoose.model("Watchlist", watchlistSchema);
