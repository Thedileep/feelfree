const express = require('express')
const router = express.Router();
const Booking = require("../models/booking");
const Therapist = require("../models/registerDocModel");
const authenticate = require("../middleware/authDocMiddleware");
const crypto =require("crypto");
const Prescription=require('../models/prescription')

// ✅ Get all appointments of a doctor
router.get("/doctor/:doctorId", authenticate, async (req, res) => {
  try {
    const { doctorId } = req.params;

    // doctor verify
    const doctorExists = await Therapist.exists({ _id: doctorId });
    if (!doctorExists) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const bookings = await Booking.find({ doctorId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.error("Error fetching doctor appointments:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// // ✅ Approve appointment
// router.put("/bookings/:id/approve", authenticate, async (req, res) => {
//   try {
//     const booking = await Booking.findByIdAndUpdate(
//       req.params.id,
//       { status: "approved" },
//       { new: true }
//     );
//     if (!booking) {
//       return res.status(404).json({ message: "Appointment not found" });
//     }
//     res.json(booking);
//   } catch (err) {
//     console.error("Error approving appointment:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

router.post("/medicine/:bookingId", authenticate, async (req, res) => {
  try {
    const { medicines, notes, userId } = req.body;
    const bookingId = req.params.bookingId;

    // Agar prescription already exist karta hai, update kar do
    let prescription = await Prescription.findOne({ bookingId });

    if (prescription) {
      prescription.medicines.push(...medicines);
      if (notes) prescription.notes = notes;
      await prescription.save();
    } else {
      // First time create hoga
      prescription = new Prescription({
        bookingId,
        doctorId: req.user.id,
        userId,
        medicines,
        notes,
      });
      await prescription.save();
    }

    res.status(201).json(prescription);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// ✅ Delete appointment completely
router.delete("/bookings/:id", authenticate, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json({ message: "Appointment deleted successfully" });
  } catch (err) {
    console.error("Error deleting appointment:", err);
    res.status(500).json({ message: "Server error" });
  }
});





module.exports = router;
