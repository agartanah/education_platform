import express from 'express';
import { connectDB } from '@shared/utils/database';
import { connectRabbitMQ } from '@shared/utils/eventBus';
import { env } from './config/env';
import { courseRoutes } from './routes/courseRouter';
import { categoryRoutes } from './routes/categoryRouter';
import { tagRoutes } from './routes/tagRouter';
import './handlers/userHandlers';
import { errorMiddleware } from './middleware/errorMiddleware';

const app = express();

async function startServer(): Promise<void> {
  try {
    await connectDB(env.mongoUri);
    await connectRabbitMQ();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(errorMiddleware);

    app.use('/courses', courseRoutes);
    app.use('/categories', categoryRoutes);
    app.use('/tags', tagRoutes);

    app.listen(env.port, () => {
      console.log(`Course Service running on port ${env.port}`);
    });
  } catch (error) {
    console.error('Course Service startup error:', error);
    process.exit(1);
  }
}

startServer();

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
