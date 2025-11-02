const AuditLog = require('../models/AuditLog');

// @desc    Get all audit logs
// @route   GET /api/audit
// @access  Public
const getAuditLogs = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const auditLogs = await AuditLog.find()
      .sort({ timestamp: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: auditLogs.length,
      data: auditLogs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get audit logs for a specific entity
// @route   GET /api/audit/entity/:id
// @access  Public
const getAuditLogsByEntity = async (req, res, next) => {
  try {
    const auditLogs = await AuditLog.find({ entityId: req.params.id })
      .sort({ timestamp: -1 });

    res.status(200).json({
      success: true,
      count: auditLogs.length,
      data: auditLogs,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAuditLogs,
  getAuditLogsByEntity,
};
