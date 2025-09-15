const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Therapist", required: true },
    orderId: { type: String, required: true },
    paymentId: { type: String },
    signature: { type: String },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["Created", "Paid", "Failed"], default: "Created" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
