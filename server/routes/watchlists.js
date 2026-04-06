const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  getMyWatchlist,
  addToWatchlist,
  updateWatchlistItem,
  deleteWatchlistItem,
} = require("../controllers/watchlistController");

router.use(protect);
router.get("/", getMyWatchlist);
router.post("/", addToWatchlist);
router.put("/:id", updateWatchlistItem);
router.delete("/:id", deleteWatchlistItem);

module.exports = router;
