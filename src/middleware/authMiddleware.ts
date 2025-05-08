import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { Course } from '../models/Course';
import { objectIdSchema } from '../schemas/objectIdSchema';
import { Types } from 'mongoose';

declare module 'express' {
  interface Request {
    userId?: string;
    role?: string;
  }
}

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).send('Доступ запрещен. Отсутствует токен авторизации.');
      return;
    }

    const decoded = jwt.verify(token, env.jwt_secret as string) as {
      userId: string;
      role: 'student' | 'teacher';
    };

    req.userId = objectIdSchema.parse(decoded.userId);
    req.role = decoded.role;

    next();
  } catch (error) {
    next(error);
  }
};

const accessTeacherMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const role = req.role;
    const userId = req.userId;
    const slug = req.params.slug;

    if (!role || role !== 'teacher') {
      res.status(403).json({
        message: 'Не доступа к редактированию курса. Нужна роль Учитель.',
      });
      return;
    }

    if (slug) {
      const course = await Course.findOne({
        slug,
        authors: { $in: [new Types.ObjectId(userId)] },
      });

      if (!course) {
        res
          .status(403)
          .json({ error: 'Данный автор не имеет доступа к данному курсу.' });
        return;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

export { authMiddleware, accessTeacherMiddleware };
