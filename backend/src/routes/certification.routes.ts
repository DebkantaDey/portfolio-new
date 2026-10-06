import { Router } from 'express';
import {
  getCertifications,
  getCertificationById,
  createCertification,
  updateCertification,
  deleteCertification,
} from '../controllers/certification.controller';
import { authenticateJwt, requireAdmin } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { certificationSchema } from '../validators';

const router = Router();

router.get('/', getCertifications);
router.get('/:id', getCertificationById);
router.post('/', authenticateJwt, requireAdmin, validateRequest(certificationSchema), createCertification);
router.put('/:id', authenticateJwt, requireAdmin, validateRequest(certificationSchema), updateCertification);
router.delete('/:id', authenticateJwt, requireAdmin, deleteCertification);

export default router;
