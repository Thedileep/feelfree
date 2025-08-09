const express = require('express');
const Therapist = require('../models/registerDocModel');
const router = express.Router();

// Get all approved doctors
router.get('/doctors', async (req, res) => {
  try {
    const doctors = await Therapist.find({ isApproved: true })
  .select('name experience rating ratingCount photoPath specialization');

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors', error });
  }
});

// Rate a doctor
router.post('/doctors/:id/rate', async (req, res) => {
  const { rating } = req.body; 
  const { id } = req.params;

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    const doctor = await Therapist.findById(id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const totalRating = doctor.rating * doctor.ratingCount;
    doctor.ratingCount += 1;
    doctor.rating = ((totalRating + rating) / doctor.ratingCount).toFixed(1);

    await doctor.save();
    res.json({ message: 'Rating updated', doctor });
  } catch (error) {
    res.status(500).json({ message: 'Error updating rating', error });
  }
});


module.exports = router;
