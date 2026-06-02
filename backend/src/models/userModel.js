import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    verifiedStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
    verificationType: { type: String, enum: ['aadhaar', 'passport', null], default: null },
    cartItems: [
      {
        vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    refreshToken: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
