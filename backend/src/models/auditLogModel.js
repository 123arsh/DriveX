import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    action: { type: String, required: true, trim: true },
    targetType: { type: String, required: true, trim: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
    summary: { type: String, trim: true },
    metadata: { type: Object },
  },
  { timestamps: true }
);

export default mongoose.model('AuditLog', auditLogSchema);
