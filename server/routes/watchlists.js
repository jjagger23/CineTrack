const express = require("express");
const router = express.Router();
const WatchList = require("../models/Watchlist");

// GET all watchlist entries
router.get("/", async (req, res) => {
  try {
    const entries = await WatchList.find().populate("showId");
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all watchlist entries for a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const entries = await WatchList.find({ userId: req.params.userId }).populate("showId");
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST add a show to watchlist
router.post("/", async (req, res) => {
  try {
    const entry = new WatchList(req.body);
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
