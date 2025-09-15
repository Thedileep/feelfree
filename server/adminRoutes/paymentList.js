const express = require('express');
const router = express.Router();
const authAdmin = require('../middleware/authAdmin');
const Payment=require('../models/payment')

router.get("/all-payments", authAdmin, async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("userId", "name email")
      .populate("doctorId", "name specialization")
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching payments" });
  }
});

module.exports=router
