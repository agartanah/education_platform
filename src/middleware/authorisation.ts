import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).send("Access denied. No token provided.");
    return;
  }

  try {
    console.log(token);
    const decoded = jwt.verify(token, env.jwt_secret as string) as {
      userId: string;
      role: "student" | "teacher";
    };
    console.log(decoded);
    req.body.user = decoded;
    next();
  } catch {
    res.status(400).send("Invalid token.");
  }
};

export { authMiddleware };
