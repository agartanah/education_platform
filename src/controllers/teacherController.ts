import { Request, Response } from "express";
import { Teacher } from "../models/teacher";

const getTeachers = async (req: Request, res: Response) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).send(teachers);
  } catch (error) {
    res.status(500).send("Something went wrong on server " + error);
  }
};

// const getTeacher = async (req: Request, res: Response) => {};

// const deleteTeacher = async (req: Request, res: Response) => {};

export { getTeachers };
