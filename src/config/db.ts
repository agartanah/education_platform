import mongoose from "mongoose";
import { env } from "./env";

export const connectDB = async () => {
  try {
    await mongoose
      .connect(env.mongoUri)
      .then(() => {
        console.log("Подключение к бд произошло успешно");
      })
      .catch((err) => {
        console.error("Ошибка подключения:", err);
      });
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};
