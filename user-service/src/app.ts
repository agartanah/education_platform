import express from 'express';
import { connectDB } from '@shared/utils/database';
import { connectRabbitMQ } from '@shared/utils/eventBus';
import { env } from './config/env';
import { authorisationRoutes } from './routes/authorisationRouter';
import { teacherRoutes } from './routes/teacherRouter';
import { studentRoutes } from './routes/studentRouter';
import { profileRoutes } from './routes/profileRouter';
import { errorMiddleware } from './middleware/errorMiddleware';
import { setupUserEventHandlers } from './handlers/courseHandlers';

const app = express();

async function startServer(): Promise<void> {
  try {
    await connectDB(env.mongoUri);
    await connectRabbitMQ();
    setupUserEventHandlers();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(errorMiddleware);

    app.use('/auth', authorisationRoutes);
    app.use('/teachers', teacherRoutes);
    app.use('/students', studentRoutes);
    app.use('/profile', profileRoutes);

    app.listen(env.port, () => {
      console.log(`User Service running on port ${env.port}`);
    });
  } catch (error) {
    console.error('User Service startup error:', error);
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
