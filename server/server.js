require("dotenv").config()
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const app = express();

connectDB();

const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:3000",
  "http://127.0.0.1:3000",
];

const corsOptions = {
  origin(origin, callback) {
    // Allow non-browser tools (curl/Postman) and configured frontend origins.
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Vary", "Origin");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  return next();
});

app.use(cors(corsOptions));
app.use(express.json());

// Routes
const showRoutes    = require("./routes/shows");
const userRoutes    = require("./routes/users");
const genreRoutes   = require("./routes/genres");
const watchlistRoutes = require("./routes/watchlists");
const reviewRoutes  = require("./routes/reviews");
const authRoutes = require("./routes/auth");

app.use("/api/shows",     showRoutes);
app.use("/api/users",     userRoutes);
app.use("/api/genres",    genreRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/reviews",   reviewRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("CineTrack API running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
