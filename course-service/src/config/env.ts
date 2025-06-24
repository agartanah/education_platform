import dotenv from 'dotenv';

dotenv.config();

export const env = {
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/education',
  port: process.env.PORT || '3002',
  jwt_secret: process.env.JWT_SECRET || 'secret',
  rabbitmqUrl: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
};
