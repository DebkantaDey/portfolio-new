import { Router } from 'express';
import {
  getCareerOpportunities,
  getCareerOpportunityById,
  createCareerOpportunity,
  updateCareerOpportunity,
  deleteCareerOpportunity,
} from '../controllers/career.controller';
import { authenticateJwt, requireAdmin } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { careerOpportunitySchema } from '../validators';

const router = Router();

router.get('/', authenticateJwt, requireAdmin, getCareerOpportunities);
router.get('/:id', authenticateJwt, requireAdmin, getCareerOpportunityById);
router.post('/', authenticateJwt, requireAdmin, validateRequest(careerOpportunitySchema), createCareerOpportunity);
router.put('/:id', authenticateJwt, requireAdmin, validateRequest(careerOpportunitySchema), updateCareerOpportunity);
router.delete('/:id', authenticateJwt, requireAdmin, deleteCareerOpportunity);

export default router;
