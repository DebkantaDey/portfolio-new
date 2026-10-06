import { Router } from 'express';
import {
  getWebsiteSettings,
  updateWebsiteSetting,
  getStatistics,
  createStatistic,
  updateStatistic,
  deleteStatistic,
  getDashboardOverview,
} from '../controllers/settings.controller';
import { authenticateJwt, requireAdmin } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { settingSchema, statisticSchema } from '../validators';

const router = Router();

// Website Settings
router.get('/settings', getWebsiteSettings);
router.put('/settings', authenticateJwt, requireAdmin, validateRequest(settingSchema), updateWebsiteSetting);

// Statistics
router.get('/statistics', getStatistics);
router.post('/statistics', authenticateJwt, requireAdmin, validateRequest(statisticSchema), createStatistic);
router.put('/statistics/:id', authenticateJwt, requireAdmin, validateRequest(statisticSchema), updateStatistic);
router.delete('/statistics/:id', authenticateJwt, requireAdmin, deleteStatistic);

// Admin Dashboard Overview
router.get('/dashboard/overview', authenticateJwt, requireAdmin, getDashboardOverview);

export default router;
