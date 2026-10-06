import { Router } from 'express';
import authRoutes from './auth.routes';
import profileRoutes from './profile.routes';
import skillRoutes from './skill.routes';
import experienceRoutes from './experience.routes';
import educationRoutes from './education.routes';
import projectRoutes from './project.routes';
import serviceRoutes from './service.routes';
import careerRoutes from './career.routes';
import certificationRoutes from './certification.routes';
import achievementRoutes from './achievement.routes';
import testimonialRoutes from './testimonial.routes';
import socialRoutes from './social.routes';
import contactRoutes from './contact.routes';
import settingsRoutes from './settings.routes';
import uploadRoutes from './upload.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/skills', skillRoutes);
router.use('/experiences', experienceRoutes);
router.use('/educations', educationRoutes);
router.use('/projects', projectRoutes);
router.use('/services', serviceRoutes);
router.use('/career', careerRoutes);
router.use('/certifications', certificationRoutes);
router.use('/achievements', achievementRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/social-links', socialRoutes);
router.use('/contact', contactRoutes);
router.use('/', settingsRoutes); // handles /settings, /statistics, /dashboard/overview
router.use('/upload', uploadRoutes);

export default router;
