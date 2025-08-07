const express = require('express');
const bcrypt = require('bcryptjs');
const Therapist = require('../models/registerDocModel');
const authDocMiddleware = require('../middleware/authDocMiddleware');
const router = express();

router.post('/therapist/change-password', authDocMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const therapist = await Therapist.findById(req.user.id);
    if (!therapist) {
      return res.status(404).json({ message: "Therapist not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, therapist.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    therapist.password = hashedPassword;
    await therapist.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error.message);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

module.exports = router;
