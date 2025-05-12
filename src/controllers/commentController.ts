import { NextFunction, Request, Response } from 'express';
import { objectIdSchema } from '../schemas/objectIdSchema';
import { Comment } from '../models/Comment';
import { Lesson } from '../models/Lesson';

const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { text } = req.body;
    const { userId } = req;
    const { slug_lesson } = req.params;

    if (!text) {
      res.status(400).json({ error: 'Текст для комментария не найден' });
      return;
    }

    const comment = await Comment.create({ user: userId, text });
    const lesson = await Lesson.findOne({ slug: slug_lesson });

    if (!lesson) {
      res.status(404).json({ error: 'Курс не найден' });
      return;
    }

    lesson.comments.push(comment.id);

    res.status(201).json({ success: true, comment_id: comment.id });
  } catch (error) {
    next(error);
  }
};

const getComments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug_lesson } = req.params;

    const comments = await Lesson.findOne({ slug: slug_lesson })
      .populate('comments')
      .select('comments');

    if (!comments) {
      res.status(404).json({ error: 'Комментарии или урок не найдены' });
      return;
    }

    res.status(200).json({ data: comments });
  } catch (error) {
    next(error);
  }
};

const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { text } = req.body;
    const comment_id = objectIdSchema.parse(req.params.comment_id);

    if (!text) {
      res.status(400).json({ error: 'Текст комментария не найден' });
    }

    if (!(await Comment.updateOne({ id: comment_id }, { text }))) {
      res.status(404).json({ error: 'Комментарий не найден' });
      return;
    }

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const comment_id = objectIdSchema.parse(req.params.comment_id);

    if (!(await Comment.deleteOne({ id: comment_id }))) {
      res.status(404).json({ error: 'Комментарий не найден' });
      return;
    }

    res.status(204).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export { getComments, createComment, updateComment, deleteComment };
