import { Router } from 'express';
import {
  getAchievements,
  getAchievementById,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} from '../controllers/achievement.controller';
import { authenticateJwt, requireAdmin } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { achievementSchema } from '../validators';

const router = Router();

router.get('/', getAchievements);
router.get('/:id', getAchievementById);
router.post('/', authenticateJwt, requireAdmin, validateRequest(achievementSchema), createAchievement);
router.put('/:id', authenticateJwt, requireAdmin, validateRequest(achievementSchema), updateAchievement);
router.delete('/:id', authenticateJwt, requireAdmin, deleteAchievement);

export default router;
