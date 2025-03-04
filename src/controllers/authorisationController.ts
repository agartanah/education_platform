import { Request, Response } from "express";
import { Student } from "../models/users";
import { Teacher } from "../models/users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

const login = async (req: Request, res: Response) => {
  try {
    const { login, password, role } = req.body;

    if (!login || !password || !role) {
      res.status(422).json({
        message: "Не все обязательные поля были предоставлены",
        requiredFields: ["login", "password", "role"],
      });
      return;
    }

    let existingUser;

    switch (role) {
      case "student":
        existingUser = await Student.findOne({ login });
        break;
      case "teacher":
        existingUser = await Teacher.findOne({ login });
        break;
      default:
        res.status(400).send("Неверная роль");
        return;
    }

    if (!existingUser) {
      res.status(400).send("Пользователь с таким логином не найден");
      return;
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordValid) {
      res.status(400).send("Неверный логин или пароль.");
    }

    // Генерируем JWT токен
    const token = jwt.sign({ userId: existingUser._id, role }, env.jwt_secret, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: {
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        login: existingUser.login,
        role,
      },
    });
  } catch (error) {
    res.status(500).send("На стороне сервера что-то пошло не так " + error);
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
        res.status(400).send("Неверная роль");
        return;
    }

    if (existingUser) {
      res.status(400).send("Такой логин уже существует.");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    registerUser.password = hashedPassword;

    await registerUser.save();
    res.status(201).send("Пользователь успешно зарегестрирован");
  } catch (error) {
    res.status(500).send("Ошибка на сервере: " + error);
  }
};

export { login, register };
