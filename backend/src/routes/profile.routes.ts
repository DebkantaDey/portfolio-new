import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profile.controller';
import { authenticateJwt, requireAdmin } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { updateProfileSchema } from '../validators';

const router = Router();

router.get('/', getProfile);
router.put('/', authenticateJwt, requireAdmin, validateRequest(updateProfileSchema), updateProfile);

export default router;
