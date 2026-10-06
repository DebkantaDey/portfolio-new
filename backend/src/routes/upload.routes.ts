import { Router } from 'express';
import { uploadFile, listUploadedFiles } from '../controllers/upload.controller';
import { authenticateJwt, requireAdmin } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.post('/', authenticateJwt, requireAdmin, upload.single('file'), uploadFile);
router.get('/', authenticateJwt, requireAdmin, listUploadedFiles);

export default router;
