import { NextFunction, Request, Response } from 'express';
import { Teacher } from '../models/Teacher';
import { Student } from '../models/Student';

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

export { getProfile, deleteProfile };
