const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const User = require("../models/registerModels");
const AuditLog = require("../models/auditLog");

const router = express.Router();

// Helper to get IP, device, and location
async function getRequestMeta(req) {
  const ip =
    req.headers["x-forwarded-for"]?.split(",").shift() ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket?.remoteAddress ||
    "";

  const deviceInfo = req.headers["user-agent"] || "";
  const timestamp = new Date();

  let location = null;
  try {
    const response = await axios.get(`https://ipinfo.io/${ip}?token=${process.env.IPINFO_TOKEN}`);
    location = response.data;
  } catch {
    location = null;
  }

  return { ip, deviceInfo, timestamp, location };
}

// User Registration
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, dob, nationality, gender, occupation } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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

    // Audit log
    const meta = await getRequestMeta(req);
    await AuditLog.create({
      userId: newUser._id,
      action: "REGISTER",
      ipAddress: meta.ip,
      deviceInfo: meta.deviceInfo,
      timestamp: meta.timestamp,
      location: meta.location,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("❌ Registration Error:", err.message);
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});

// User Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      const meta = await getRequestMeta(req);
      await AuditLog.create({
        action: "LOGIN_FAILED_NO_USER",
        ipAddress: meta.ip,
        deviceInfo: meta.deviceInfo,
        timestamp: meta.timestamp,
        location: meta.location,
      });
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const meta = await getRequestMeta(req);
      await AuditLog.create({
        userId: user._id,
        action: "LOGIN_FAILED_WRONG_PASSWORD",
        ipAddress: meta.ip,
        deviceInfo: meta.deviceInfo,
        timestamp: meta.timestamp,
        location: meta.location,
      });
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const meta = await getRequestMeta(req);
    await AuditLog.create({
      userId: user._id,
      action: "LOGIN_SUCCESS",
      ipAddress: meta.ip,
      deviceInfo: meta.deviceInfo,
      timestamp: meta.timestamp,
      location: meta.location,
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("❌ Login Error:", err.message);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

module.exports = router;
