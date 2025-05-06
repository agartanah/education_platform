import { Category } from '../models/Category';
import { Request, Response, NextFunction } from 'express';
import { objectIdSchema } from '../schemas/objectIdSchema';

const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categories = await Category.find();

    res.status(200).json({ data: categories });
  } catch (error) {
    next(error);
  }
};

const getCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category_id = objectIdSchema.parse(req.params.category_id);

    const category = await Category.findById(category_id);

    if (!category) {
      res.status(404).json({ message: 'Категория не найдена' });
      return;
    }

    res.status(200).json({ data: category });
  } catch (error) {
    next(error);
  }
};

const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name } = req.body;

    const category = await Category.create({ name });

    res.status(201).json({ success: true, category_id: category.id });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const category_id = objectIdSchema.parse(req.params.category_id);
    const { name } = req.body;

    if (!name) {
      res.status(400).json({
        error: 'Новое название категории не было найдено в теле запроса',
      });
      return;
    }

    const category = await Category.findById(category_id);

    if (!category) {
      res.status(404).json({ error: 'Категория не найдена' });
      return;
    }

    category.name = name;
    await category.save();

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const category_id = objectIdSchema.parse(req.params.category_id);

    await Category.deleteOne({ _id: category_id });

    res.status(204).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
