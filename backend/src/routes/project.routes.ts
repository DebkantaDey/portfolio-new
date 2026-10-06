import { Router } from 'express';
import {
  getProjects,
  getProjectBySlug,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/project.controller';
import { authenticateJwt, requireAdmin } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { projectSchema } from '../validators';

const router = Router();

router.get('/', getProjects);
router.get('/slug/:slug', getProjectBySlug);
router.get('/:id', getProjectById);
router.post('/', authenticateJwt, requireAdmin, validateRequest(projectSchema), createProject);
router.put('/:id', authenticateJwt, requireAdmin, validateRequest(projectSchema), updateProject);
router.delete('/:id', authenticateJwt, requireAdmin, deleteProject);

export default router;
