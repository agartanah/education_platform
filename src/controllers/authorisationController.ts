import { NextFunction, Request, Response } from 'express';
import { Teacher } from '../models/Teacher';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { Student } from '../models/Student';

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { login, password, role } = req.body;

    if (!login || !password || !role) {
      res.status(422).json({
        message: 'Не все обязательные поля были предоставлены',
        requiredFields: ['login', 'password', 'role'],
      });
      return;
    }

    let existingUser;

    switch (role) {
      case 'student':
        existingUser = await Student.findOne({ login }).select('+password');
        break;
      case 'teacher':
        existingUser = await Teacher.findOne({ login }).select('+password');
        break;
      default:
        res.status(400).json({ error: 'Неверная роль' });
        return;
    }

    if (!existingUser) {
      res.status(404).json({ error: 'Пользователь с таким логином не найден' });
      return;
    }

    if (!existingUser.password) {
      res.status(400).json({ error: 'Пароль не установлен' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password as string,
    );

    if (!isPasswordValid) {
      res.status(400).json({ error: 'Неверный логин или пароль.' });
      return;
    }

    const token = jwt.sign({ userId: existingUser._id, role }, env.jwt_secret, {
      expiresIn: '1h',
    });

    res.status(200).json({
      token,
      user: {
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        login: existingUser.login,
        role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { first_name, last_name, login, password, role } = req.body;

    let existingUser, registerUser;

    switch (role) {
      case 'student':
        existingUser = await Student.findOne({ login });
        registerUser = new Student({
          firstName: first_name,
          lastName: last_name,
          login,
        });

        break;
      case 'teacher':
        existingUser = await Teacher.findOne({ login });
        registerUser = new Teacher({
          firstName: first_name,
          lastName: last_name,
          login,
        });

        break;
      default:
        res.status(400).json({ error: 'Неверная роль' });
        return;
    }

    if (existingUser) {
      res.status(400).json({ error: 'Такой логин уже существует.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    registerUser.password = hashedPassword;

    await registerUser.save();

    res.status(201).json({ success: true, user_id: registerUser.id });
  } catch (error) {
    next(error);
  }
};

export { login, register };
