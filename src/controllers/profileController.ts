import { NextFunction, Request, Response } from 'express';
import { Teacher } from '../models/Teacher';
import { Student } from '../models/Student';
import { objectIdSchema } from '../schemas/objectIdSchema';
import { Course } from '../models/Course';
import { Types } from 'mongoose';

const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, role } = req;

    if (!userId) {
      res.status(400).json({ error: 'ID Пользователя не найдено' });
      return;
    }

    let user;

    switch (role) {
      case 'student':
        user = await Student.findById(userId);
        break;
      case 'teacher':
        user = await Teacher.findById(userId);
        break;
      default:
        res.status(400).json({ error: 'Неверная роль' });
        return;
    }

    if (!user) {
      res.status(404).json({ error: 'Пользователь не найден' });
      return;
    }

    res.status(200).json({
      data: {
        firstName: user?.firstName,
        lastName: user?.lastName,
        login: user?.login,
        role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const changeFavoriteCourse = (add: boolean = true) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, role } = req;
      const course_id = objectIdSchema.parse(req.body.course_id);

      if (!userId) {
        res.status(400).json({ error: 'ID Пользователя не был найден' });
        return;
      }

      if (!role || role !== 'student') {
        res.status(400).json({ error: 'Неверная роль' });
      }

      if (!(await Course.findById(course_id))) {
        res.status(404).json({ error: 'Курс не найден' });
        return;
      }

      const student = await Student.findById(userId);

      if (!student) {
        res.status(404).json({ error: 'Студент не найден' });
        return;
      }

      const objectIdCourse = new Types.ObjectId(course_id);

      if (add) {
        student.favorite_courses.push(objectIdCourse);
      } else {
        student.favorite_courses.pull(objectIdCourse);
      }

      student.save();

      res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  };
};

const deleteProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId, role } = req;

    if (!userId) {
      res.status(400).json({ error: 'ID Пользователя не найден' });
      return;
    }

    let delUser;

    switch (role) {
      case 'student':
        delUser = await Student.findByIdAndDelete(userId);

        break;
      case 'teacher':
        delUser = await Teacher.findByIdAndDelete(userId);

        break;
      default:
        res.status(400).json({ error: 'Неверная роль' });
        return;
    }

    if (!delUser) {
      res.status(400).json({ error: 'Пользователь не найден' });
      return;
    }

    res.status(204).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export { getProfile, changeFavoriteCourse, deleteProfile };
