const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const Therapist = require('../models/registerDocModel');
const User = require('../models/registerModels'); 

// POST /api/check-availability

router.post('/check-availability', async (req, res) => {
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



router.post('/bookings', async (req, res) => {
  const { doctorId, date, time, userId } = req.body;

  if (!doctorId || !date || !time || !userId) {
    return res.status(400).json({ message: 'doctorId, date, time and userId required' });
  }

  try {
    // Check if doctor exists
    const doctorExists = await Therapist.exists({ _id: doctorId });
    if (!doctorExists) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check if user exists
    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the slot is already booked
    const existingBooking = await Booking.findOne({
      doctorId,
      date,
      time,
      status: { $ne: 'cancelled' },
    });

    if (existingBooking) {
      return res.status(409).json({ message: 'Slot already booked' });
    }

    // Create booking
    const booking = new Booking({ doctorId, date, time, userId });
    await booking.save();

    return res.status(201).json(booking);
  } catch (err) {
    console.error('Error creating booking:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});


// GET /api/bookings/times?doctorId=...&date=...
router.get('/bookings/times', async (req, res) => {
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


module.exports = router;
