import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    role: { type: String, enum: ['super-admin', 'manager', 'operator'], default: 'operator' },
    lastLogin: { type: Date },
    otpCodeHash: { type: String },
    otpExpiresAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model('Admin', adminSchema);
