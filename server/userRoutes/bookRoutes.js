const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const Therapist = require('../models/registerDocModel');
const User = require('../models/registerModels'); 
const mongoose = require('mongoose');
const authMiddleware=require('../middleware/authMiddleware')
// POST /api/check-availability

router.post('/check-availability',authMiddleware, async (req, res) => {
  const { doctorId, date, time } = req.body;

  if (!doctorId || !date || !time) {
    return res.status(400).json({ message: 'doctorId, date, and time are required' });
  }

  try {
    // Check if doctor exists
    const doctorExists = await Therapist.exists({ _id: doctorId });
    if (!doctorExists) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check if the slot is already booked
    const existingBooking = await Booking.findOne({ doctorId, date, time, status: { $ne: 'cancelled' } });

    if (existingBooking) {
      return res.json({ available: false });
    } else {
      return res.json({ available: true });
    }
  } catch (err) {
    console.error('Error checking availability:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});


router.post('/bookings', authMiddleware,async (req, res) => {
  const { doctorId, date, time, userId } = req.body;

  if (!doctorId || !date || !time || !userId) {
    return res.status(400).json({ message: 'doctorId, date, time, and userId required' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1️⃣ Check doctor exists
    const doctorExists = await Therapist.exists({ _id: doctorId }).session(session);
    if (!doctorExists) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // 2️⃣ Check user exists
    const userExists = await User.exists({ _id: userId }).session(session);
    if (!userExists) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'User not found' });
    }

    // 3️⃣ Check slot availability inside the transaction
    const existingBooking = await Booking.findOne({
      doctorId,
      date,
      time,
      status: { $ne: 'cancelled' }
    }).session(session);

    if (existingBooking) {
      await session.abortTransaction();
      return res.status(409).json({ message: 'Slot already booked' });
    }

    // 4️⃣ Create booking
    const booking = new Booking({
      doctorId,
      date,
      time,
      userId,
      status: 'confirmed' 
    });

    await booking.save({ session });

    // 5️⃣ Commit transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({ success: true, booking });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error creating booking:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});


// GET /api/bookings/times?doctorId=...&date=...
router.get('/bookings/times',authMiddleware, async (req, res) => {
  const { doctorId, date } = req.query;

  if (!doctorId || !date) {
    return res.status(400).json({ message: 'doctorId and date are required' });
  }

  try {
    const bookings = await Booking.find({
      doctorId,
      date,
      status: { $ne: 'cancelled' }
    }).select('time -_id'); 

    const bookedTimes = bookings.map(b => b.time);

    return res.json({ bookedTimes });
  } catch (err) {
    console.error('Error fetching booked times:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get("/bookings/user", authMiddleware, async (req, res) => {

  if (!req.user || !req.user.id) {
    return res.status(400).json({ message: "Invalid user data in token" });
  }

  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate("doctorId", "name specialty");
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching user bookings:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/bookings/:id
router.get('/bookings/:id', authMiddleware,async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('doctorId', 'name specialty')
      .populate('userId', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (err) {
    console.error("Error fetching booking:", err);
    res.status(500).json({ message: 'Server error' });
  }
});






module.exports = router;
