import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { Course } from '../models/Course';
import { objectIdSchema } from '../schemas/objectIdSchema';
import { Types } from 'mongoose';
import { Student } from '../models/Student';
import { Lesson } from '../models/Lesson';

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
    const { role } = req;

    if (!role || role !== 'teacher') {
      res.status(403).json({
        message: 'Не доступа к редактированию курса. Нужна роль Учитель.',
      });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};

const accessStudentMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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

const accessCourseMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId, role } = req;
    const { slug_course } = req.params;

    let user, course;

    switch (role) {
      case 'student':
        course = await Course.findOne({ slug: slug_course });

        if (!course) {
          res.status(404).json({ error: 'Курс не найден' });
          return;
        }

        user = await Student.findOne({
          id: userId,
          access_courses: { $in: [course.id] },
        });

        if (!user) {
          res.status(401).json({ error: 'Нет доступа к данному курсу' });
          return;
        }

        break;
      case 'teacher':
        course = await Course.findOne({
          slug: slug_course,
          authors: { $in: [new Types.ObjectId(userId)] },
        });

        if (!course) {
          res
            .status(401)
            .json({ error: 'Данный автор не имеет доступа к данному курсу' });
          return;
        }

        break;
      default:
        res.status(400).json({ error: 'Неверная роль' });
        return;
    }

    next();
  } catch (error) {
    next(error);
  }
};

const checkLessonBelongCourse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { slug_course, slug_lesson } = req.params;

    const course = await Course.findOne({ slug: slug_course });

    if (!course) {
      res.status(404).json({ error: 'Курс не найден' });
      return;
    }

    if (!(await Lesson.findOne({ slug: slug_lesson, course: course.id }))) {
      res.status(404).json({ error: 'Такой урок у данного курса не найден' });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};

export {
  authMiddleware,
  accessTeacherMiddleware,
  accessStudentMiddleware,
  accessCourseMiddleware,
  checkLessonBelongCourse,
};
