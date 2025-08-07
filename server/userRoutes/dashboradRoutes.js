const express = require("express");
const authenticate = require('../middleware/authDocMiddleware');

const router = express.Router();

router.get("/dashboard", require('../middleware/authMiddleware'), (req, res) => {
  res.json({ message: `Welcome, user ${req.user.email}` });
});

router.get('/dashboard-doc', authenticate, (req, res) => {
  res.status(200).json({ message: 'Welcome to therapist dashboard', user: req.user });
});



module.exports = router;
