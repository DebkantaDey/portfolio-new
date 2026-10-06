import { Router } from 'express';
import {
  getEducations,
  getEducationById,
  createEducation,
  updateEducation,
  deleteEducation,
} from '../controllers/education.controller';
import { authenticateJwt, requireAdmin } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { educationSchema } from '../validators';

const router = Router();

router.get('/', getEducations);
router.get('/:id', getEducationById);
router.post('/', authenticateJwt, requireAdmin, validateRequest(educationSchema), createEducation);
router.put('/:id', authenticateJwt, requireAdmin, validateRequest(educationSchema), updateEducation);
router.delete('/:id', authenticateJwt, requireAdmin, deleteEducation);

export default router;
