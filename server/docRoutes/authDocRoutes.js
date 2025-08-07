const express = require('express');
const bcrypt = require('bcryptjs');
const Therapist = require('../models/registerDocModel');
const upload = require('../middleware/upload');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post(
  '/register-therapist',
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'degree', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      console.log('Request body:', req.body);
      console.log('Uploaded files:', req.files);

      const {
        name, email, phone, dob, nationality,
        occupation, experience, address, specialization,
        licenseNumber, password
      } = req.body;

      if (!name || !email || !phone || !dob || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const existing = await Therapist.findOne({ email });
      if (existing) return res.status(400).json({ message: 'Email already exists' });

      const hashedPassword = await bcrypt.hash(password, 10);

      const therapist = new Therapist({
        name, email, phone, dob, nationality,
        occupation, experience, address, specialization,
        licenseNumber,
        photoPath: req.files?.photo?.[0]?.path || '',
        degreePath: req.files?.degree?.[0]?.path || '',
        password: hashedPassword
      });

      await therapist.save();
      res.status(201).json({ message: 'Therapist registered successfully' });
    } catch (err) {
      console.error('Registration Error:', err);
      res.status(500).json({ message: 'Registration failed', error: err.message });
    }
  }
);


// Login route

router.post('/login-therapist', async (req, res) => {
  try {
    const { email, password } = req.body;

    const therapist = await Therapist.findOne({ email });
    if (!therapist) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, therapist.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    if (!therapist.isApproved) {
      return res.status(403).json({
        message: 'Your account is under review. You will be notified once approved by admin.'
      });
    }

    const token = jwt.sign(
      { id: therapist._id, role: 'therapist' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, user: therapist });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});


module.exports = router;

