import { Router } from 'express';
import {
  getExperiences,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
} from '../controllers/experience.controller';
import { authenticateJwt, requireAdmin } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { experienceSchema } from '../validators';

const router = Router();

router.get('/', getExperiences);
router.get('/:id', getExperienceById);
router.post('/', authenticateJwt, requireAdmin, validateRequest(experienceSchema), createExperience);
router.put('/:id', authenticateJwt, requireAdmin, validateRequest(experienceSchema), updateExperience);
router.delete('/:id', authenticateJwt, requireAdmin, deleteExperience);

export default router;
