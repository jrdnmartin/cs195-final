const express = require("express");
const {
  registerUser,
  loginUser,
  getMe,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected route
router.get("/me", authMiddleware, getMe);

module.exports = router;