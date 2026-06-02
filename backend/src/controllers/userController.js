import Booking from '../models/bookingModel.js';
import User from '../models/userModel.js';
import Vehicle from '../models/vehicleModel.js';
import generateBookingId from '../utils/generateBookingId.js';

export async function getProfile(req, res, next) {
  try {
    const user = await User.findById(req.user.userId).select('-passwordHash -refreshToken');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user.userId, updates, { new: true }).select('-passwordHash -refreshToken');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    next(error);
  }
}

export async function getBookings(req, res, next) {
  try {
    const bookings = await Booking.find({ userId: req.user.userId }).populate('vehicleId', 'name slug brand category pricePerDay');
    res.json({ data: bookings });
  } catch (error) {
    next(error);
  }
}

export async function createBooking(req, res, next) {
  try {
    const { vehicleId, startDate, endDate, rentalDays, pricePerDay } = req.body;
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    if (vehicle.availabilityStatus !== 'available') {
      return res.status(409).json({ error: 'Vehicle is not currently available' });
    }

    const booking = await Booking.create({
      bookingId: generateBookingId(),
      userId: req.user.userId,
      vehicleId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      rentalDays,
      pricePerDay,
      totalCost: rentalDays * pricePerDay,
      status: 'pending',
      verificationStatus: 'pending',
    });

    await Vehicle.findByIdAndUpdate(vehicleId, { availabilityStatus: 'reserved' });

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
}
