const express = require('express');
const router = express.Router();
const Therapist = require('../models/registerDocModel');
const authAdmin = require('../middleware/authAdmin');
const sendApprovalSMS = require('../adminRoutes/smsRoutes');
const sendApprovalEmail = require('../adminRoutes/mailRoutes');

// GET all therapists
router.get('/pending-therapists', authAdmin, async (req, res) => {
  try {
    const allTherapists = await Therapist.find();
    res.status(200).json(allTherapists);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// POST: Approve or Disapprove therapist
router.post('/update-approval/:id', authAdmin, async (req, res) => {
  try {
    const { status } = req.body; 

    const therapist = await Therapist.findByIdAndUpdate(
      req.params.id,
      { isApproved: status },
      { new: true }
    );

    if (!therapist) {
      return res.status(404).json({ error: 'Therapist not found' });
    }

    if (status) {
      try {
        await sendApprovalSMS(therapist.phone, therapist.name);
        await sendApprovalEmail(therapist.email, therapist.name);
      } catch (notifyErr) {
        console.error('Notification Error:', notifyErr.message);
      }
    }

    res.status(200).json({
      message: `Therapist ${status ? 'approved' : 'disapproved'} successfully`,
      therapist,
    });
  } catch (error) {
    res.status(500).json({ error: 'Update failed' });
  }
});

// DELETE: Delete therapist by ID
router.delete('/delete-therapist/:id', authAdmin, async (req, res) => {
  try {
    const deletedTherapist = await Therapist.findByIdAndDelete(req.params.id);
    if (!deletedTherapist) {
      return res.status(404).json({ error: 'Therapist not found' });
    }
    res.status(200).json({ message: 'Therapist deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete therapist' });
  }
});


module.exports = router;
