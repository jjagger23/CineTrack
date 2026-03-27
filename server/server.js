require("dotenv").config()
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Routes
const showRoutes    = require("./routes/shows");
const userRoutes    = require("./routes/users");
const genreRoutes   = require("./routes/genres");
const watchlistRoutes = require("./routes/watchlists");
const reviewRoutes  = require("./routes/reviews");

app.use("/api/shows",     showRoutes);
app.use("/api/users",     userRoutes);
app.use("/api/genres",    genreRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/reviews",   reviewRoutes);

app.get("/", (req, res) => {
  res.send("CineTrack API running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});