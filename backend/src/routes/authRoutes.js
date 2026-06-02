import { Router } from 'express';
import { login, signup, refreshToken } from '../controllers/authController.js';
import { signupSchema, loginSchema } from '../validators/authValidator.js';
import validateRequest from '../middlewares/validateRequest.js';

const router = Router();

router.post('/signup', validateRequest(signupSchema), signup);
router.post('/login', validateRequest(loginSchema), login);
router.post('/refresh', refreshToken);

export default router;
