const express = require("express");
const router = express.Router();
const Show = require("../models/Show");
const Review = require("../models/Review");
const Watchlist = require("../models/Watchlist");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

// GET all shows
router.get("/", async (req, res) => {
  try {
    const shows = await Show.find();
    res.json(shows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single show by ID
router.get("/:id", async (req, res) => {
  try {
    const show = await Show.findById(req.params.id);
    if (!show) return res.status(404).json({ message: "Show not found" });
    res.json(show);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create new show
router.post("/", async (req, res) => {
  try {
    const show = new Show(req.body);
    await show.save();
    res.status(201).json(show);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE show (admin) + related data cleanup
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const show = await Show.findById(req.params.id);
    if (!show) return res.status(404).json({ message: "Show not found" });

    await Review.deleteMany({ showId: show._id });
    await Watchlist.deleteMany({ showId: show._id });
    await show.deleteOne();

    return res.json({ message: "Show and related content deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
