import mongoose from 'mongoose';

const verificationDocumentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    nationality: { type: String, enum: ['indian', 'foreign'], required: true },
    aadhaarNumber: { type: String, trim: true },
    passportNumber: { type: String, trim: true },
    documents: {
      aadhaarFront: { type: String },
      aadhaarBack: { type: String },
      licenseFront: { type: String },
      licenseBack: { type: String },
      passportFront: { type: String },
      passportBack: { type: String },
    },
    status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
    adminNotes: { type: String, trim: true },
    submittedAt: { type: Date, default: Date.now },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

verificationDocumentSchema.index({ userId: 1, status: 1 });

export default mongoose.model('VerificationDocument', verificationDocumentSchema);
