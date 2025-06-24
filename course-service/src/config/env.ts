import dotenv from 'dotenv';

dotenv.config();

export const env = {
  mongoUri:
    process.env.MONGO_URI ||
    'mongodb://admin:password@mongodb:27017/education?authSource=admin',
  port: process.env.PORT || '3002',
  jwt_secret: process.env.JWT_SECRET || 'secret',
  rabbitmqUrl:
    process.env.RABBITMQ_URL || 'amqp://admin:password@rabbitmq:5672',
};
