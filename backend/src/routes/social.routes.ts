import { Router } from 'express';
import {
  getSocialLinks,
  getSocialLinkById,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
} from '../controllers/social.controller';
import { authenticateJwt, requireAdmin } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { socialLinkSchema } from '../validators';

const router = Router();

router.get('/', getSocialLinks);
router.get('/:id', getSocialLinkById);
router.post('/', authenticateJwt, requireAdmin, validateRequest(socialLinkSchema), createSocialLink);
router.put('/:id', authenticateJwt, requireAdmin, validateRequest(socialLinkSchema), updateSocialLink);
router.delete('/:id', authenticateJwt, requireAdmin, deleteSocialLink);

export default router;
