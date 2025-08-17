const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: { type: String, enum: ['REGISTER', 'LOGIN_SUCCESS', 'LOGIN_FAILED'], required: true },
  ipAddress: String,
  deviceInfo: String,
  timestamp: Date,
  location: {
    ip: String,
    city: String,
    region: String,
    country: String,
    loc: String,
    org: String,
    postal: String,
    timezone: String,
  },
});


module.exports = mongoose.model("AuditLog", auditLogSchema);
