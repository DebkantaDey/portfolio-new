import { Router } from 'express';
import {
  submitContactMessage,
  getContactMessages,
  getContactMessageById,
  updateContactMessage,
  deleteContactMessage,
} from '../controllers/contact.controller';
import { authenticateJwt, requireAdmin } from '../middleware/auth.middleware';
import { contactRateLimiter } from '../middleware/rateLimiter.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { contactMessageSchema } from '../validators';

const router = Router();

// Public contact submission with rate limit & honeypot anti-spam
router.post('/', contactRateLimiter, validateRequest(contactMessageSchema), submitContactMessage);

// Admin-protected inbox management
router.get('/', authenticateJwt, requireAdmin, getContactMessages);
router.get('/:id', authenticateJwt, requireAdmin, getContactMessageById);
router.patch('/:id', authenticateJwt, requireAdmin, updateContactMessage);
router.delete('/:id', authenticateJwt, requireAdmin, deleteContactMessage);

export default router;
