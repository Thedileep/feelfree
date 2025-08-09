const mongoose = require('mongoose');

const therapistSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  dob: String,
  nationality: String,
  occupation: String,
  experience: String,
  address: String,
  specialization: String,
  licenseNumber: String,
  photoPath: String,
  degreePath: String,
  password: String,
  isApproved: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0 
  },
  ratingCount: {
    type: Number,
    default: 0 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Therapist', therapistSchema);
