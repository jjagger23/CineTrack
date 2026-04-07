const User = require("../models/User");
const Review = require("../models/Review");
const Watchlist = require("../models/Watchlist");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ message: "Cannot delete admin account" });
    }

    await Review.deleteMany({ userId: user._id });
    await Watchlist.deleteMany({ userId: user._id });
    await user.deleteOne();
    res.json({ message: "User and related content deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
