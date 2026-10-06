import { Router } from 'express';
import { login, getMe, logout, updatePassword } from '../controllers/auth.controller';
import { authenticateJwt } from '../middleware/auth.middleware';
import { authRateLimiter } from '../middleware/rateLimiter.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { loginSchema, updatePasswordSchema } from '../validators';

const router = Router();

router.post('/login', authRateLimiter, validateRequest(loginSchema), login);
router.get('/me', authenticateJwt, getMe);
router.post('/logout', logout);
router.put('/password', authenticateJwt, validateRequest(updatePasswordSchema), updatePassword);

export default router;
