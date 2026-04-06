const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const {
  getAllReviews,
  getReviewsForShow,
  createReview,
  updateOwnReview,
  deleteOwnReview,
  adminDeleteReview,
} = require("../controllers/reviewController");
const Review = require("../models/Review");

router.get("/", getAllReviews);
router.get("/show/:showId", getReviewsForShow);
router.get("/user/:userId", async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.params.userId })
      .populate("userId", "username role")
      .populate("showId", "title")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post("/", protect, createReview);
router.put("/:id", protect, updateOwnReview);
router.delete("/:id", protect, deleteOwnReview);
router.delete("/admin/:id", protect, adminOnly, adminDeleteReview);

module.exports = router;
