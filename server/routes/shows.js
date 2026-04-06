const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const {
  getShows,
  searchExternalShows,
  getShowById,
  createShow,
  updateShow,
  deleteShow,
} = require("../controllers/showController");

router.get("/", getShows);
router.get("/search-external", searchExternalShows);
router.get("/:id", getShowById);
router.post("/", protect, adminOnly, createShow);
router.put("/:id", protect, adminOnly, updateShow);
router.delete("/:id", protect, adminOnly, deleteShow);

module.exports = router;
