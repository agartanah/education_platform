import { Tag } from '@shared/models/Tag';
import { Request, Response, NextFunction } from 'express';
import { objectIdSchema } from '../schemas/objectIdSchema';

const getTags = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tags = await Tag.find();

    res.status(200).json({ data: tags });
  } catch (error) {
    next(error);
  }
};

const getTag = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tag_id = objectIdSchema.parse(req.params.tag_id);

    const tag = await Tag.findById(tag_id);

    if (!tag) {
      res.status(404).json({ message: 'Тег не найден' });
      return;
    }

    res.status(200).json({ data: tag });
  } catch (error) {
    next(error);
  }
};

const createTag = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;

    const tag = await Tag.create({ name });

    res.status(201).json({ success: true, tag_id: tag.id });
  } catch (error) {
    next(error);
  }
};

const updateTag = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tag_id = objectIdSchema.parse(req.params.tag_id);
    const { name } = req.body;

    if (!name) {
      res.status(400).json({
        error: 'Новое название тега не было найдено в теле запроса',
      });
      return;
    }

    const tag = await Tag.findById(tag_id);

    if (!tag) {
      res.status(404).json({ error: 'Тег не найден' });
      return;
    }

    tag.name = name;
    await tag.save();

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

const deleteTag = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tag_id = objectIdSchema.parse(req.params.tag_id);

    await Tag.deleteOne({ _id: tag_id });

    res.status(204).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export { getTags, getTag, createTag, updateTag, deleteTag };
