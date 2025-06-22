import { NextFunction, Request, Response } from 'express';
import { Teacher } from '../models/Teacher';

const getTeachers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teachers = await Teacher.find().select('-password');

    res.status(200).json({ data: teachers });
  } catch (error) {
    next(error);
  }
};

export { getTeachers };
