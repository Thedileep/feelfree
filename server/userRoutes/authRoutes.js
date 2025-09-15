const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const passport = require("passport");
const nodemailer = require("nodemailer");

const User = require("../models/registerModels");
const AuditLog = require("../models/auditLog");

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

// Nodemailer transporter (use Gmail or any SMTP service)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
});

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
    transporter.sendMail({
      to: email,
      subject: "Verify your email",
      html: `<p>Click <a href="${verifyURL}">here</a> to verify your account.</p>`
    }).catch(err => console.error("Email send failed:", err));


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
router.post("/login", (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      const meta = await getRequestMeta(req);
      await AuditLog.create({
        action: "LOGIN_FAILED",
        ipAddress: meta.ip,
        deviceInfo: meta.deviceInfo,
        timestamp: meta.timestamp,
        location: meta.location
      });
      return res.status(400).json({ message: info.message });
    }

    const token = jwt.sign({ id: user._id, role: "user" }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });

    const meta = await getRequestMeta(req);
    await AuditLog.create({
      userId: user._id,
      action: "LOGIN_SUCCESS",
      ipAddress: meta.ip,
      deviceInfo: meta.deviceInfo,
      timestamp: meta.timestamp,
      location: meta.location
    });

    res.json({
      message: "Login successful",
      token,
      user: { _id: user._id, name: user.name, email: user.email }
    });
  })(req, res, next);
});

module.exports = router;
