const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  bookingId: { type: String, required: true },
  sender: { type: String, required: true }, 
  text: String,
  image: String,
  audio: String,
  video: String,
  deletedFor: [String], 
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
