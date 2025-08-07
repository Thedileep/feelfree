const express = require("express");
const router = express.Router();
const Journal = require("../models/journalModel");
const authMiddleware = require("../middleware/authMiddleware");

// POST - Save journal entry
router.post("/journal-post", authMiddleware, async (req, res) => {
  try {
    const entry = new Journal({
      user: req.user.id,
      text: req.body.text
    });
    await entry.save();
    res.json({ message: "Journal entry saved." });
  } catch (err) {
    res.status(500).json({ error: "Failed to save entry" });
  }
});

// GET - Fetch journal entries
router.get("/journal-get", authMiddleware, async (req, res) => {
  try {
    const entries = await Journal.find({ user: req.user.id }).sort({ date: -1 });
    res.json({ entries });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch entries" });
  }
});

module.exports = router;
