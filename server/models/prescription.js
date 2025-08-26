
const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Therapist", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  medicines: [
    {
      name: String,
      dosage: String,
      frequency: String,
    },
  ],
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports=mongoose.model("Prescription", prescriptionSchema);
