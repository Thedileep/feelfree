const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dob: { type: Date },
  nationality: { type: String },
  gender: { type: String },
  occupation: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
