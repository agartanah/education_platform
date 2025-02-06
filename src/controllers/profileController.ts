import { Request, Response } from "express";
import { Student, Teacher } from "../models/users";

const getProfile = async (req: Request, res: Response) => {
  const userId = req.body.user.userId;
  const role = req.body.user.role;

  if (!userId) {
    res.status(400).send("User not found");
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
      res.status(400).send("Invalid role");
      return;
  }

  if (!user) {
    res.status(400).send("User not find");
  }

  console.log(user);
  res.json({
    firstName: user?.firstName,
    lastName: user?.lastName,
    login: user?.login,
    role,
  });
};

const deleteProfile = async (req: Request, res: Response) => {
  const userId = req.body.user.userId;
  const role = req.body.user.role;

  if (!userId) {
    res.status(400).send("User not found");
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
      res.status(400).send("Inalid role");
      return;
  }

  if (!delUser) {
    res.status(400).send("User not find");
    return;
  }

  res.json({ message: "User has been deleted" });
};

export { getProfile, deleteProfile };
