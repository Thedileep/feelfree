const express = require('express');
const router = express.Router();
const authAdmin = require('../middleware/authAdmin');
const Prescription= require('../models/prescription')

// ✅ Get all prescriptions
router.get("/get-medicine", authAdmin, async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate("userId", "name email") 
      .populate("doctorId", "name email specialization")
      .populate("bookingId", "time date status")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      prescriptions,
    });
  } catch (err) {
    console.error("Error fetching prescriptions:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Get prescription by bookingId
router.get("/get-medicine/:bookingId", authAdmin, async (req, res) => {
  try {
    const { bookingId } = req.params;

    const prescription = await Prescription.findOne({ bookingId })
      .populate("userId", "name email") // 👈 FIX here too
      .populate("doctorId", "name email specialization")
      .populate("bookingId", "time date status");

    if (!prescription) {
      return res.status(404).json({ success: false, message: "Prescription not found" });
    }

    res.status(200).json({ success: true, prescription });
  } catch (err) {
    console.error("Error fetching prescription:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports=router;
