import { Router } from 'express';
import {
  getServices,
  getServiceBySlug,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from '../controllers/service.controller';
import { authenticateJwt, requireAdmin } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { serviceSchema } from '../validators';

const router = Router();

router.get('/', getServices);
router.get('/slug/:slug', getServiceBySlug);
router.get('/:id', getServiceById);
router.post('/', authenticateJwt, requireAdmin, validateRequest(serviceSchema), createService);
router.put('/:id', authenticateJwt, requireAdmin, validateRequest(serviceSchema), updateService);
router.delete('/:id', authenticateJwt, requireAdmin, deleteService);

export default router;
