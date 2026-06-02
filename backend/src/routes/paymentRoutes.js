import { Router } from 'express';
import { createPaymentOrder, verifyPayment } from '../controllers/paymentController.js';
import { requireAuth } from '../middlewares/securityMiddleware.js';
import validateRequest from '../middlewares/validateRequest.js';
import { createPaymentOrderSchema, verifyPaymentSchema } from '../validators/paymentValidator.js';

const router = Router();

router.use(requireAuth);
router.post('/order', validateRequest(createPaymentOrderSchema), createPaymentOrder);
router.post('/verify', validateRequest(verifyPaymentSchema), verifyPayment);

export default router;
