const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const makeToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

const ensureDefaultAdminAccount = async () => {
  const existing = await User.findOne({ username: ADMIN_USERNAME });

  if (!existing) {
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await User.create({
      username: ADMIN_USERNAME,
      password: hashedPassword,
      role: "admin"
    });
    return;
  }

  const passwordMatches = await bcrypt.compare(ADMIN_PASSWORD, existing.password);
  if (existing.role !== "admin" || !passwordMatches) {
    existing.role = "admin";
    existing.password = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await existing.save();
  }
};

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    if (username.toLowerCase() === ADMIN_USERNAME.toLowerCase()) {
      return res.status(400).json({ message: "This username is reserved" });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
      role: "user"
    });

    res.status(201).json({
      token: makeToken(user),
      user: {
        _id: user._id,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username && username.toLowerCase() === ADMIN_USERNAME.toLowerCase()) {
      await ensureDefaultAdminAccount();
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const matches = await bcrypt.compare(password, user.password);
    if (!matches) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      token: makeToken(user),
      user: {
        _id: user._id,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
