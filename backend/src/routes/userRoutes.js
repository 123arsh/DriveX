import { Router } from 'express';
import { requireAuth } from '../middlewares/securityMiddleware.js';
import { getProfile, updateProfile, getBookings, createBooking } from '../controllers/userController.js';
import { createBookingSchema } from '../validators/bookingValidator.js';
import validateRequest from '../middlewares/validateRequest.js';

const router = Router();

router.use(requireAuth);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/bookings', getBookings);
router.post('/bookings', validateRequest(createBookingSchema), createBooking);

export default router;
