import dotenv from "dotenv";

dotenv.config();

export const env = {
  mongoUri: process.env.MONGO_URI || "",
  port: process.env.PORT || "",
  jwt_secret: process.env.JWT_SECRET || "",
};
