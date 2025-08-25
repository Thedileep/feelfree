const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Therapist", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },

  // 🆕 Meeting fields
  meetingId: { type: String },
  meetingLink: { type: String },
  meetingExpiresAt: { type: Date },
});

module.exports = mongoose.model("Booking", bookingSchema);
