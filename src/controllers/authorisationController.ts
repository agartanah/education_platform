import { Request, Response } from "express";
import { Student } from "../models/users";
import { Teacher } from "../models/users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

const main = async (req: Request, res: Response) => {
  res.redirect("/login");
};

const login = async (req: Request, res: Response) => {
  try {
    const { login, password, role } = req.body;

    let existingUser;

    // Проверяем, существует ли пользователь с данным логином
    switch (role) {
      case "student":
        existingUser = await Student.findOne({ login });
        break;
      case "teacher":
        existingUser = await Teacher.findOne({ login });
        break;
      default:
        res.status(400).send("Invalid role");
        return;
    }

    if (!existingUser) {
      res.status(400).send("Invalid login or password");
      return;
    }

    // Сравниваем введённый пароль с сохранённым хэшом
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordValid) {
      res.status(400).send("Invalid login or password");
    }

    // Генерируем JWT токен
    const token = jwt.sign(
      { userId: existingUser._id, role }, // Включаем id пользователя и роль в payload
      env.jwt_secret as string, // Секретный ключ для подписи
      { expiresIn: "1h" }, // Время жизни токена
    );

    res.json({
      token,
      user: {
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        login: existingUser.login,
        role, // также отправляем роль
      },
    });
  } catch (error) {
    res.status(500).send("Something went wrong on server " + error);
  }
};

const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, login, password, role } = req.body;

    let existingUser, registerUser;

    switch (role) {
      case "student":
        existingUser = await Student.findOne({ login });
        registerUser = new Student({ firstName, lastName, login });

        break;
      case "teacher":
        existingUser = await Teacher.findOne({ login });
        registerUser = new Teacher({ firstName, lastName, login });

        break;
      default:
        res.status(400).send("Invalid role");
        return;
    }

    if (existingUser) {
      res.status(400).send("Login is already taken");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    registerUser.password = hashedPassword;

    await registerUser.save();
    res.status(201).send("User registered successfully");
  } catch (error) {
    res.status(500).send("Error on server: " + error);
  }
};

// const getStudent = async (req: Request, res: Response) => {};

// const deleteStudent = async (req: Request, res: Response) => {};

export { main, login, register };
