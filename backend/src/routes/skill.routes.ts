import { Router } from 'express';
import {
  getSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
  reorderSkills,
} from '../controllers/skill.controller';
import { authenticateJwt, requireAdmin } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { skillSchema, reorderSchema } from '../validators';

const router = Router();

router.get('/', getSkills);
router.get('/:id', getSkillById);
router.post('/', authenticateJwt, requireAdmin, validateRequest(skillSchema), createSkill);
router.put('/reorder', authenticateJwt, requireAdmin, validateRequest(reorderSchema), reorderSkills);
router.put('/:id', authenticateJwt, requireAdmin, validateRequest(skillSchema), updateSkill);
router.delete('/:id', authenticateJwt, requireAdmin, deleteSkill);

export default router;
