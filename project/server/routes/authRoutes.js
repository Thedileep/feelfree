const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/registerModels");

const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
  const { name, email, password, dob, nationality, gender, occupation } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 5);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      dob,
      nationality,
      gender,
      occupation,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ 
        error: "Server error during registration",
        message:"something went wrong"
     });
  }
});

module.exports = router;
