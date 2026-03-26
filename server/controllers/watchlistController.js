const Watchlist = require("../models/Watchlist");

exports.getMyWatchlist = async (req, res) => {
  try {
    const list = await Watchlist.find({ userId: req.user._id })
      .populate("showId")
      .sort({ addedAt: -1 });

    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addToWatchlist = async (req, res) => {
  try {
    const { showId, status, progress } = req.body;

    const entry = await Watchlist.create({
      userId: req.user._id,
      showId,
      status: status || "Plan to Watch",
      progress: progress || 0
    });

    const populated = await entry.populate("showId");
    res.status(201).json(populated);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Show already exists in watchlist" });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.updateWatchlistItem = async (req, res) => {
  try {
    const item = await Watchlist.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!item) {
      return res.status(404).json({ message: "Watchlist item not found" });
    }

    item.status = req.body.status ?? item.status;
    item.progress = req.body.progress ?? item.progress;

    await item.save();
    const populated = await item.populate("showId");

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteWatchlistItem = async (req, res) => {
  try {
    const item = await Watchlist.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!item) {
      return res.status(404).json({ message: "Watchlist item not found" });
    }

    res.json({ message: "Removed from watchlist" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};