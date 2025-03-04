import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

declare module "express" {
  interface Request {
    userId?: string;
    role?: string;
  }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).send("Доступ запрещен. Отсутствует токен авторизации.");
    return;
  }

  try {
    console.log(token);
    const decoded = jwt.verify(token, env.jwt_secret as string) as {
      userId: string;
      role: "student" | "teacher";
    };

    console.log(decoded);
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch {
    res.status(400).send("Неверный токен.");
  }
};

export { authMiddleware };
