import { Request, Response } from "express";
import { Teacher } from "../models/users";

const getTeachers = async (req: Request, res: Response) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).send(teachers);
  } catch (error) {
    res.status(500).send("На сервере что-то пошло не так " + error);
  }
};

export { getTeachers };
