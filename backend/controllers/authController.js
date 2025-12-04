const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * POST /api/auth/register
 * Body: { name, email, password }
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    // Check if user already exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "A user with that email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
    });

    res.status(201).json({
      message: "User registered successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Error in registerUser:", err);
    res.status(500).json({ message: "Server error during registration." });
  }
};

// POST /api/auth/login
// Body: { email, password }
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Create JWT payload
    const payload = {
      userId: user._id,
      householdId: user.household || null,
    };

    // Sign token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        household: user.household,
      },
    });
  } catch (err) {
    console.error("Error in loginUser:", err);
    res.status(500).json({ message: "Server error during login." });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated." });
    }

    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      household: req.user.household,
    });
  } catch (err) {
    console.error("Error in getMe:", err);
    res.status(500).json({ message: "Server error fetching user." });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};