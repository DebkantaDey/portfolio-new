import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import { ENV } from './config/env';
import { standardRateLimiter } from './middleware/rateLimiter.middleware';
import { errorHandler } from './middleware/error.middleware';
import { setupSwagger } from './config/swagger';
import apiRoutes from './routes';
import { sendError } from './utils/apiResponse';

export const createApp = (): Express => {
  const app = express();

  // 1. Security Headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  // 2. CORS configuration
  app.use(
    cors({
      origin: [ENV.CORS_ORIGIN, 'http://localhost:3000', 'http://127.0.0.1:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // 3. Body parsing & cookies
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  // 4. Rate limiting for general traffic
  app.use('/api', standardRateLimiter);

  // 5. Static uploads directory
  const uploadsPath = path.resolve(process.cwd(), ENV.UPLOAD_DIR);
  app.use('/uploads', express.static(uploadsPath));

  // 6. Swagger API Documentation
  setupSwagger(app);

  // 7. Health check
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      service: 'portfolio-backend-api',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // 8. Main API Routes
  app.use('/api', apiRoutes);

  // 9. 404 Handler
  app.use((req: Request, res: Response) => {
    sendError(res, `Route '${req.originalUrl}' not found on this server`, 404);
  });

  // 10. Global Error Handler
  app.use(errorHandler);

  return app;
};
