const express = require("express");
const router = express.Router();
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const { getUsers, deleteUser } = require("../controllers/userController");

router.get("/", protect, adminOnly, getUsers);
router.delete("/:id", protect, adminOnly, deleteUser);
router.get("/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
