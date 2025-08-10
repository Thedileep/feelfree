const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  ipAddress: String,
  deviceInfo: String,
  timestamp: { type: Date, default: Date.now },
  location: Object, // ya aapke hisab se subfields
});

module.exports = mongoose.model("AuditLog", auditLogSchema);
