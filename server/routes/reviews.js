const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

// GET all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().populate("userId", "username");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all reviews for a specific show
router.get("/show/:showId", async (req, res) => {
  try {
    const reviews = await Review.find({ showId: req.params.showId }).populate("userId", "username");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all reviews by a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.params.userId }).populate("userId", "username");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create a new review
router.post("/", async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
