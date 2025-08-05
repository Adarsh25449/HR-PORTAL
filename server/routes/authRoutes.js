// server/routes/authRoutes.js
const express = require("express");
const User = require("../models/User");
const router = express.Router();

// ✅ Signup route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();
    const trimmedPassword = password.trim();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // ✅ New user defaults to "employee" role
    const newUser = new User({
      name: trimmedName,
      email: normalizedEmail,
      password: trimmedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "Signup successful" });

  } catch (error) {
    console.error("❌ Signup error:", error);

    if (error.code === 11000 && error.keyPattern?.email) {
      return res.status(400).json({ error: "Email already exists" });
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ error: messages.join(", ") });
    }

    res.status(500).json({ error: "Server error during signup" });
  }
});

// ✅ Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user || user.password !== trimmedPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // ✅ Include role in response so frontend can route properly
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role, // ✅ this line enables admin redirection
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ error: "Server error during login" });
  }
});

module.exports = router;






