const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/registerModels");
const auditLog = require("../models/auditLog");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password, dob, nationality, gender, occupation } = req.body;

  try {
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 5);

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

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const ip =
      req.headers["x-forwarded-for"]?.split(",").shift() ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket?.remoteAddress ||
      "";

    const deviceInfo = req.headers["user-agent"] || "";
    const timestamp = new Date();

    async function getLocation(ip) {
      try {
        const response = await axios.get(`https://ipinfo.io/${ip}/json?token=${process.env.IPINFO_TOKEN}`);

        return response.data;
      } catch {
        return null;
      }
    }

    const location = await getLocation(ip);

    // Log the login attempt
    const loginLog = {
      userId: user._id,
      ipAddress: ip,
      deviceInfo,
      timestamp,
      location,
    };

    await auditLog.create(loginLog);

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error during login",
      message: "Something went wrong",
    });
  }
});

module.exports = router;
