import { Router } from 'express';
import authRoutes from './authRoutes.js';
import vehicleRoutes from './vehicleRoutes.js';
import userRoutes from './userRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/user', userRoutes);
router.use('/payments', paymentRoutes);
router.use('/secure-admin-panel', adminRoutes);

router.get('/', (req, res) => {
  res.json({ status: 'DriveX API', version: '1.0.0' });
});

export default router;
