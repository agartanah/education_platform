import { Request, Response } from "express";
import { Student } from "../models/student";

const getStudents = async (req: Request, res: Response) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).send("Something went wrong on server " + error);
  }
};

// const getStudent = async (req: Request, res: Response) => {};

// const deleteStudent = async (req: Request, res: Response) => {};

export { getStudents };
