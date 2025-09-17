const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const passport = require("passport");
const nodemailer = require("nodemailer");

const User = require("../models/registerModels");
const AuditLog = require("../models/auditLog");
const {sendDoctorBookingEmail,sendVerificationEmail}=require('../adminRoutes/mailRoutes')

const router = express.Router();

// Helper to get IP, device, and location
async function getRequestMeta(req) {
  const ip =
    req.headers["x-forwarded-for"]?.split(",").shift() ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    "";

  const deviceInfo = req.headers["user-agent"] || "";
  const timestamp = new Date();
  const location = null;
  return { ip, deviceInfo, timestamp, location };
}



// ==================== REGISTER ====================
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
    const token = crypto.randomBytes(32).toString("hex");

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      dob,
      nationality,
      gender,
      occupation,
      verificationToken: token
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
      location: meta.location
    });

     const verifyURL = `${process.env.BASE_URL}/api/auth/verify/${token}`;
       try {
      await sendVerificationEmail(email,verifyURL);
    } catch (mailErr) {
      console.error("Error sending booking email:", mailErr.message);
    }


    res.status(201).json({ message: "User registered. Please verify your email." });

   
  } catch (err) {
    console.log("Registration error:", err);
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});


// ==================== EMAIL VERIFY ====================
router.get("/verify/:token", async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });
    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();


    return res.send(`
      <html>
        <head>
          <title>Email Verified</title>
          <style>
            body { font-family: Arial, sans-serif; background:#f0f8ff; text-align:center; padding:50px; }
            .card { max-width:400px; margin:auto; background:#fff; padding:30px; border-radius:12px; box-shadow:0 2px 6px rgba(0,0,0,0.1); }
            h2 { color:#28a745; }
            a { display:inline-block; margin-top:20px; padding:10px 20px; background:#28a745; color:#fff; border-radius:8px; text-decoration:none; }
            a:hover { background:#218838; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>✅ Email Verified Successfully</h2>
            <p>You can now login to your account.</p>
            <a href="https://feelfree-3ktk.onrender.com/#/login/user">Go to Login</a>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    res.status(500).json({ message: "Verification failed", error: err.message });
  }
});

// ==================== LOGIN ====================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // User check
    const user = await User.findOne({ email });
    if (!user) {
      const meta = await getRequestMeta(req);
      await AuditLog.create({
        action: "LOGIN_FAILED",
        ipAddress: meta.ip,
        deviceInfo: meta.deviceInfo,
        timestamp: meta.timestamp,
        location: meta.location
      });
      return res.status(404).json({ message: "User not found" });
    }

    // Password check
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const meta = await getRequestMeta(req);
      await AuditLog.create({
        userId: user._id,
        action: "LOGIN_FAILED",
        ipAddress: meta.ip,
        deviceInfo: meta.deviceInfo,
        timestamp: meta.timestamp,
        location: meta.location
      });
      return res.status(401).json({ message: "Password mismatch" });
    }

    // Check if email verified
    if (!user.isVerified) {
      return res.status(403).json({ message: "Email not verified. Please verify your email first." });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: "user" }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Audit log for successful login
    const meta = await getRequestMeta(req);
    await AuditLog.create({
      userId: user._id,
      action: "LOGIN_SUCCESS",
      ipAddress: meta.ip,
      deviceInfo: meta.deviceInfo,
      timestamp: meta.timestamp,
      location: meta.location
    });

    // Response
    res.status(200).json({
      message: "Login successful",
      token,
      user: { _id: user._id, name: user.name, email: user.email }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

module.exports = router;
