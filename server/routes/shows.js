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

// GET TVmaze search fallback results by query
router.get("/tvmaze/search", async (req, res) => {
  const query = String(req.query.q || "").trim();
  if (!query) return res.status(400).json({ message: "Query is required" });

  try {
    const tvmazeRes = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`);
    if (!tvmazeRes.ok) {
      return res.status(502).json({ message: "TVmaze search failed" });
    }

    const rows = await tvmazeRes.json();
    const results = (Array.isArray(rows) ? rows : []).slice(0, 20).map(entry => {
      const show = entry?.show || {};
      return {
        tvmazeId: show.id,
        title: show.name || "Untitled",
        type: show.type || "Show",
        genre: Array.isArray(show.genres) ? show.genres : [],
        releaseYear: show.premiered ? Number(String(show.premiered).slice(0, 4)) : null,
        description: show.summary ? String(show.summary).replace(/<[^>]*>/g, "").trim() : "",
        posterUrl: show.image?.original || show.image?.medium || "",
        rating: show.rating?.average || null,
        externalUrl: show.url || "",
      };
    });

    return res.json(results);
  } catch (err) {
    return res.status(500).json({ message: err.message || "TVmaze request failed" });
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
