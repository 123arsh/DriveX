import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Admin from '../models/adminModel.js';
import Booking from '../models/bookingModel.js';
import Vehicle from '../models/vehicleModel.js';
import Payment from '../models/paymentModel.js';
import User from '../models/userModel.js';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'admin@drivex.com').split(',').map((email) => email.trim().toLowerCase());

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function createAdminToken(admin) {
  return jwt.sign({ adminId: admin._id, role: admin.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '2h' });
}

export async function requestAdminOtp(req, res, next) {
  try {
    const { email } = req.body;
    if (!email || !ADMIN_EMAILS.includes(email.toLowerCase())) {
      return res.status(403).json({ error: 'Admin access denied' });
    }

    const otpCode = generateOtp();
    const otpCodeHash = await bcrypt.hash(otpCode, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const admin = await Admin.findOneAndUpdate(
      { email: email.toLowerCase() },
      { email: email.toLowerCase(), otpCodeHash, otpExpiresAt: expiresAt },
      { upsert: true, new: true }
    );

    console.log(`Admin OTP for ${admin.email}: ${otpCode}`);

    res.json({ message: 'OTP generated and sent to admin email placeholder' });
  } catch (error) {
    next(error);
  }
}

export async function verifyAdminOtp(req, res, next) {
  try {
    const { email, otp } = req.body;
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin || !admin.otpCodeHash || !admin.otpExpiresAt || new Date() > admin.otpExpiresAt) {
      return res.status(400).json({ error: 'OTP expired or invalid' });
    }

    const isValid = await bcrypt.compare(otp, admin.otpCodeHash);
    if (!isValid) {
      return res.status(400).json({ error: 'OTP invalid' });
    }

    admin.otpCodeHash = undefined;
    admin.otpExpiresAt = undefined;
    admin.lastLogin = new Date();
    await admin.save();

    const token = createAdminToken(admin);
    res.json({ token, admin: { email: admin.email, role: admin.role } });
  } catch (error) {
    next(error);
  }
}

export async function getAdminDashboard(req, res) {
  const activeRentals = await Booking.countDocuments({ status: 'confirmed' });
  const totalVehicles = await Vehicle.countDocuments();
  const pendingVerifications = await Booking.countDocuments({ verificationStatus: 'pending' });
  const revenueResult = await Payment.aggregate([
    { $match: { status: 'paid' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const revenue = revenueResult[0]?.total ? revenueResult[0].total / 100 : 0;
  const activeUsers = await User.countDocuments({ role: 'customer' });

  res.json({
    activeRentals,
    totalVehicles,
    revenue,
    pendingVerifications,
    activeUsers,
  });
}
