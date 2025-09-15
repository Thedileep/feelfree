const express = require("express");
const router = express.Router();
const Mood = require('../models/moodModel');
const authMiddleware = require("../middleware/authMiddleware");

// Add mood
router.post("/mood-track", authMiddleware,async (req, res) => {
  try {
    const { userId, mood, moodValue, note } = req.body;
    const newMood = new Mood({ userId, mood, moodValue, note });
    await newMood.save();
    res.json(newMood);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all moods
router.get("/get-mood/:userId",authMiddleware, async (req, res) => {
  try {
    const moods = await Mood.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(moods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
