import { createApp } from './app';
import { ENV } from './config/env';
import { dbService } from './services/db.service';
import { logger } from './utils/logger';

const startServer = async () => {
  try {
    logger.info('Initializing database services...');
    await dbService.init();

    const app = createApp();

    const server = app.listen(ENV.PORT, () => {
      logger.info(`Portfolio Backend REST API running on http://localhost:${ENV.PORT}`);
      logger.info(`Interactive API Documentation: http://localhost:${ENV.PORT}/api-docs`);
      logger.info(`Health check: http://localhost:${ENV.PORT}/health`);
    });

    const shutdown = () => {
      logger.info('Received termination signal. Shutting down gracefully...');
      server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    logger.error('Fatal server startup failure:', error);
    process.exit(1);
  }
};

startServer();
