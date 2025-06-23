import mongoose from 'mongoose';

export const connectDB = async (mongoUri: string): Promise<void> => {
  try {
    await mongoose.connect(mongoUri);
    console.log('Подключение к бд произошло успешно');
  } catch (err) {
    console.error('Ошибка подключения:', err);
    process.exit(1);
  }
};
