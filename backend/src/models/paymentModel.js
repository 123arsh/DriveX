import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: { type: String, enum: ['created', 'paid', 'failed', 'refunded'], default: 'created' },
    method: { type: String },
    captured: { type: Boolean, default: false },
    receiptUrl: { type: String },
    webhookVerified: { type: Boolean, default: false },
    refundStatus: { type: String, enum: ['none', 'requested', 'processed', 'rejected'], default: 'none' },
  },
  { timestamps: true }
);

paymentSchema.index({ razorpayOrderId: 1, razorpayPaymentId: 1 });

export default mongoose.model('Payment', paymentSchema);
