import crypto from 'crypto';
import Razorpay from 'razorpay';
import Booking from '../models/bookingModel.js';
import Payment from '../models/paymentModel.js';
import Vehicle from '../models/vehicleModel.js';

function getRazorpayInstance() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials are not configured');
  }

  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

export async function createPaymentOrder(req, res, next) {
  try {
    const { bookingId } = req.body;
    if (!bookingId) {
      return res.status(400).json({ error: 'Booking ID is required' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking || booking.userId.toString() !== req.user.userId) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.status !== 'pending') {
      return res.status(409).json({ error: 'Booking already processed' });
    }

    const amountInPaise = Math.round(booking.totalCost * 100);
    const orderOptions = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: booking.bookingId,
      payment_capture: 1,
      notes: {
        bookingId: booking._id.toString(),
        userId: req.user.userId,
      },
    };

    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create(orderOptions);

    await Payment.findOneAndUpdate(
      { razorpayOrderId: order.id },
      {
        bookingId: booking._id,
        userId: req.user.userId,
        razorpayOrderId: order.id,
        amount: amountInPaise,
        currency: 'INR',
        status: 'created',
      },
      { upsert: true, new: true }
    );

    res.json({ order, bookingId: booking._id });
  } catch (error) {
    next(error);
  }
}

export async function verifyPayment(req, res, next) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Payment verification fields are required' });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return res.status(500).json({ error: 'Razorpay secret is not configured' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Payment signature mismatch' });
    }

    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
    if (!payment) {
      return res.status(404).json({ error: 'Payment record not found' });
    }

    if (payment.status === 'paid') {
      return res.status(409).json({ error: 'Payment already verified' });
    }

    payment.razorpayPaymentId = razorpay_payment_id;
    payment.status = 'paid';
    payment.captured = true;
    payment.method = 'razorpay';
    await payment.save();

    const booking = await Booking.findById(payment.bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking record not found' });
    }

    booking.status = 'confirmed';
    booking.paymentId = payment._id;
    booking.invoiceUrl = `${process.env.FRONTEND_URL || 'http://localhost:4173'}/invoice/${booking.bookingId}`;
    booking.verificationStatus = 'pending';
    await booking.save();

    await Vehicle.findByIdAndUpdate(booking.vehicleId, { availabilityStatus: 'reserved' });

    res.json({ message: 'Payment verified successfully', payment, booking });
  } catch (error) {
    next(error);
  }
}
