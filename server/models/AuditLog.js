const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: ['CREATE', 'UPDATE', 'DELETE'],
  },
  entityType: {
    type: String,
    required: true,
    default: 'USER',
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false, // Not required for failed operations
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  },
  userEmail: {
    type: String,
    required: false,
  },
  userName: {
    type: String,
    required: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Index for faster queries
auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ entityId: 1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;
