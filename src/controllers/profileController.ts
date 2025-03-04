import { Request, Response } from "express";
import { Student, Teacher } from "../models/users";

const getProfile = async (req: Request, res: Response) => {
  const { userId, role } = req.body.user;

  if (!userId) {
    res.status(400).send("Пользователь не найден");
    return;
  }

  let user;

  switch (role) {
    case "student":
      user = await Student.findById(userId);
      break;
    case "teacher":
      user = await Teacher.findById(userId);
      break;
    default:
      res.status(400).send("Неверная роль");
      return;
  }

  if (!user) {
    res.status(400).send("Пользователь не найден");
  }

  res.json({
    firstName: user?.firstName,
    lastName: user?.lastName,
    login: user?.login,
    role,
  });
};

const deleteProfile = async (req: Request, res: Response) => {
  const userId = req.userId;
  const role = req.role;

  if (!userId) {
    res.status(400).send("Пользователь не найден");
    return;
  }

  let delUser;

  switch (role) {
    case "student":
      delUser = await Student.findByIdAndDelete(userId);

      break;
    case "teacher":
      delUser = await Teacher.findByIdAndDelete(userId);

      break;
    default:
      res.status(400).send("Неверная роль");
      return;
  }

  if (!delUser) {
    res.status(400).send("Пользователь не найден");
    return;
  }

  res.status(200).json({ message: "Пользователь был успешно удалён" });
};

export { getProfile, deleteProfile };
