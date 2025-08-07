const express=require('express')
const Therapist = require('../models/registerDocModel');
const authMiddleware=require('../middleware/authDocMiddleware')

const router = express.Router();


router.get('/therapist/profile', authMiddleware, async (req, res) => {
  try {
    const therapist = await Therapist.findById(req.user.id).select('-password');
    res.json(therapist);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports=router
