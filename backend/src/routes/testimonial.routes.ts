import { Router } from 'express';
import {
  getTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../controllers/testimonial.controller';
import { authenticateJwt, requireAdmin } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { testimonialSchema } from '../validators';

const router = Router();

router.get('/', getTestimonials);
router.get('/:id', getTestimonialById);
router.post('/', authenticateJwt, requireAdmin, validateRequest(testimonialSchema), createTestimonial);
router.put('/:id', authenticateJwt, requireAdmin, validateRequest(testimonialSchema), updateTestimonial);
router.delete('/:id', authenticateJwt, requireAdmin, deleteTestimonial);

export default router;
