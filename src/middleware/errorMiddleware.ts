import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

interface CustomError extends Error {
  status?: number;
}

export const errorMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (err instanceof ZodError) {
    res.status(400).json({ message: 'Ошибка валидации', errors: err.errors });
    return;
  }

  const statusCode = err.status || 500;
  const message = err.message || 'Внутренняя ошибка сервера';

  res.status(statusCode).json({ message });
};
