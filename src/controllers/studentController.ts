import { NextFunction, Request, Response } from 'express';
import { Student } from '../models/Student';

const getStudents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const students = await Student.find().select('-password');

    res.status(200).json({ data: students });
  } catch (error) {
    next(error);
  }
};

export { getStudents };
