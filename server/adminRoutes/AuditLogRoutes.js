const express = require("express");
const AuditLog = require("../models/auditLog");
const DoctorAuditLog = require("../models/docAuditLog");
const authAdmin = require("../middleware/authAdmin");
const auditLog = require("../models/auditLog");
const docAuditLog = require("../models/docAuditLog");

const router = express.Router();

/**
 * ✅ Get all normal user audit logs (Admin only) with full tracking data
 */
router.get("/admin/user-audit-logs", authAdmin, async (req, res) => {
  try {
    const logs = await AuditLog.find({})
      .populate("userId", "name email nationality gender ")
      .select("userId ipAddress deviceInfo location timestamp action")
      .sort({ timestamp: -1 })
      .lean();

   

    res.json({ count: logs.length, logs: logs });
  } catch (err) {
    console.error("❌ Error fetching user audit logs:", err);
    res.status(500).json({
      message: "Failed to fetch user audit logs",
      error: err.message
    });
  }
});

/**
 * ✅ Get all therapist audit logs (Admin only) with full tracking data
 */
router.get("/admin/therapist-audit-logs", authAdmin, async (req, res) => {
  try {
    const logs = await DoctorAuditLog.find({})
      .populate("therapistId", "name email nationality")
      .sort({ timestamp: -1 })
      .lean();

    // Attach extra tracking info clearly
    const formattedLogs = await docAuditLog.find({})
    .populate("therapistId","ip city region country loc org postal timezone")
    .lean();

    res.status(200).json({
      count: formattedLogs.length,
      logs: logs,
      data:formattedLogs
    });

  } catch (err) {
    console.error("❌ Error fetching therapist audit logs:", err);
    res.status(500).json({
      message: "Failed to fetch therapist audit logs",
      error: err.message
    });
  }
});

router.delete("/admin/audit-log/:id", authAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Try deleting from both collections
    const userDelete = await AuditLog.findByIdAndDelete(id);
    const therapistDelete = await DoctorAuditLog.findByIdAndDelete(id);

    if (!userDelete && !therapistDelete) {
      return res.status(404).json({ message: "Audit log not found" });
    }

    res.status(200).json({ message: "Audit log deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting audit log:", err);
    res.status(500).json({
      message: "Failed to delete audit log",
      error: err.message
    });
  }
});

module.exports = router;
