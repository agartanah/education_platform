import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

declare module 'express' {
  interface Request {
    userId?: string;
    role?: string;
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).send('Доступ запрещен. Отсутствует токен авторизации.');
      return;
    }

    const decoded = jwt.verify(token, env.jwt_secret) as {
      userId: string;
      role: string;
    };

    req.userId = decoded.userId;
    req.role = decoded.role;

    next();
  } catch (error) {
    next(error);
  }
};

export const accessTeacherMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { role } = req;

    if (!role || role !== 'teacher') {
      res.status(403).json({
        message: 'Нет доступа к редактированию курса. Нужна роль Учитель.',
      });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const accessStudentMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { role } = req;

    if (!role || role !== 'student') {
      res.status(403).json({ error: 'Неверная роль' });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};
