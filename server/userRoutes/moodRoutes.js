const express = require("express");
const router = express.Router();
const Mood = require("../models/moodModel");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/mood-tracker", authMiddleware, async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user.id }).sort({ date: -1 });
    res.json({ moods });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch moods" });
  }
});

module.exports = router;
