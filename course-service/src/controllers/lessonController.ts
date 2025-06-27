import { NextFunction, Request, Response } from 'express';
import { Lesson, LessonAttributes, Course } from '@shared/models';
import { FilterQuery } from 'mongoose';
import {
  createLessonSchema,
  updateLessonSchema,
} from '../schemas/lessonSchema';
import {
  deleteVideoLesson,
  transformLessonVideo,
} from '../utils/transformFiles';
import path from 'path';
import fs from 'fs';

const getLessons = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const { slug_course } = req.params;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const filter: FilterQuery<typeof Lesson> = {};

    const course = await Course.findOne({ slug: slug_course });

    if (!course) {
      res.status(404).json({ error: 'Курс не найден' });
      return;
    }

    if (search) {
      filter.$and = [
        { title: { $regex: search, $options: 'i' }, course: course.id },
      ];
    }

    const lessons = await Lesson.find(filter)
      .sort({ order: 1 })
      .select('title slug')
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    res.status(200).json({
      data: lessons,
      pagination: {
        total: lessons.length,
        page,
        limit,
        pages: Math.ceil(lessons.length / limitNumber),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getLesson = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug_lesson } = req.params;

    const lesson = await Lesson.find({ slug: slug_lesson })
      .populate('comments')
      .populate('course');

    if (!lesson) {
      res.status(404).json({ error: 'Урок не найден' });
      return;
    }

    res.status(200).json({ data: lesson });
  } catch (error) {
    next(error);
  }
};

const createLesson = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, content } = createLessonSchema.parse(req.body);
    const { slug_course } = req.params;
    console.log(slug_course);
    const course = await Course.findOne({ slug: slug_course });

    if (!course) {
      res.status(404).json({ error: 'Курс не найден' });
      return;
    }

    const lesson = await Lesson.create({
      title,
      content,
      course: course.id,
    });

    console.log(lesson.slug);
    res.status(201).json({ success: true, slug_lesson: lesson.slug });
  } catch (error) {
    next(error);
  }
};

const updateLesson = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, content, course_id } = updateLessonSchema.parse(req.body);
    const { slug_lesson } = req.params;

    const updateData = {} as LessonAttributes;

    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;

    if (course_id !== undefined) {
      if (!(await Course.findById(course_id))) {
        res.status(404).json({ error: 'Курс не найден' });
        return;
      }

      updateData.course = course_id;
    }

    if (!(await Lesson.updateOne({ slug: slug_lesson }, updateData))) {
      res.status(404).json({ error: 'Урок не найден' });
      return;
    }

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

const changeOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug_lesson } = req.params;
    const { order } = req.body;

    const lesson = await Lesson.findOne({ slug: slug_lesson });

    if (!lesson) {
      res.status(404).json({ error: 'Урок не найден' });
      return;
    }

    const oldOrder = lesson.order as number;
    if (oldOrder === order) {
      res
        .status(400)
        .json({ error: 'Новая позиция урока совпадает со старой' });
      return;
    }

    const courseId = lesson.course;

    if (order < oldOrder) {
      await Lesson.updateMany(
        {
          course: courseId,
          order: { $gte: order, $lt: oldOrder },
        },
        { $inc: { order: 1 } }
      );
    } else {
      await Lesson.updateMany(
        {
          course: courseId,
          order: { $gt: oldOrder, $lte: order },
        },
        { $inc: { order: -1 } }
      );
    }

    lesson.order = order;
    await lesson.save();

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

const getVideo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { quality = '720p' } = req.query;
    const { slug_lesson } = req.params;
    const dir = path.join(process.cwd(), 'videos', 'processed');

    const lesson = await Lesson.findOne({ slug: slug_lesson });

    if (!lesson) {
      res.status(404).json({ error: 'Урок не найден' });
      return;
    }

    const ext = path.extname(lesson.video as string);
    const filename = path.basename(lesson.video as string, ext);

    const filePath = path.join(dir, `${filename}_${quality}.mp4`);

    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: 'Видео не найдено' });
      return;
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (!range) {
      res.status(416).json({ error: 'Необходим Range заголовок' });
      return;
    }

    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    const stream = fs.createReadStream(filePath, { start, end });

    const headers = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(206, headers);
    stream.pipe(res);
  } catch (error) {
    next(error);
  }
};

const updateVideo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = req.file;
    const { slug_lesson } = req.params;

    if (!file) {
      res.status(400).json({ error: 'Видео не найдено в теле запроса' });
      return;
    }

    const lesson = await Lesson.findOne({ slug: slug_lesson });

    if (!lesson) {
      res.status(404).json({ error: 'Урок не найден' });
      return;
    }

    if (lesson.video) {
      if (!(await deleteVideoLesson(lesson.video as string))) {
        res.status(500).json({ error: 'Ошибка удаления видео' });
        return;
      }
    }

    if (!(await transformLessonVideo(file.path))) {
      res.status(500).json({ error: 'Ошибка преобразования видео' });
      return;
    }

    lesson.video = file.filename;
    await lesson.save();

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const deleteLesson = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slug_lesson } = req.params;

    if (!(await Lesson.deleteOne({ slug: slug_lesson }))) {
      res.status(404).json({ error: 'Урок не найден' });
    }

    res.status(204).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export {
  getLessons,
  getLesson,
  createLesson,
  updateLesson,
  changeOrder,
  getVideo,
  updateVideo,
  deleteLesson,
};
