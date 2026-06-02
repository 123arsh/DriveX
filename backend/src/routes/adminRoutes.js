import { Router } from 'express';
import { requestAdminOtp, verifyAdminOtp, getAdminDashboard } from '../controllers/adminAuthController.js';
import { requireAuth } from '../middlewares/securityMiddleware.js';
import requireAdmin from '../middlewares/requireAdmin.js';

const router = Router();

router.post('/auth/login', requestAdminOtp);
router.post('/auth/verify', verifyAdminOtp);
router.use(requireAuth);
router.use(requireAdmin);
router.get('/dashboard', getAdminDashboard);

export default router;
