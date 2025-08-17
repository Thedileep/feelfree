const mongoose = require('mongoose');

const doctorAuditLogSchema = new mongoose.Schema({
  therapistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Therapist', required: true },
  action: { type: String, enum: ['REGISTER', 'LOGIN_SUCCESS', 'LOGIN_FAILED'], required: true },
  ipAddress: String,
  deviceInfo: String,
  timestamp: { type: Date, default: Date.now },
  location: Object
});

module.exports = mongoose.model('DoctorAuditLog', doctorAuditLogSchema);
