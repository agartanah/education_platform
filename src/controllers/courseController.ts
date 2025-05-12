import { NextFunction, Request, Response } from 'express';
import { Course, CourseAttributes } from '../models/Course';
import { FilterQuery } from 'mongoose';
import { Category } from '../models/Category';
import { Tag } from '../models/Tag';
import { Teacher } from '../models/Teacher';
import {
  createCourseSchema,
  updateCourseSchema,
} from '../schemas/courseSchema';
import path from 'path';
import fs from 'fs';
import { transformCourseImage } from '../utils/transformFiles';
import { Student } from '../models/Student';

const getCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      categories = [],
      minPrice = 0,
      maxPrice = 10000000,
      tags = [],
    } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const minPriceNumber = Number(minPrice);
    const maxPriceNumber = Number(maxPrice);

    const tagArray = Array.isArray(tags) ? tags : [tags];
    const categoryArray = Array.isArray(categories) ? categories : [categories];

    const filter: FilterQuery<typeof Course> = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'author.firstName': { $regex: search, $options: 'i' } },
        { 'author.lastName': { $regex: search, $options: 'i' } },
      ];
    }

    if (categoryArray.length > 0) {
      filter.categories = { $in: categoryArray };
    }

    filter.price = { $gte: minPriceNumber, $lte: maxPriceNumber };

    if (tagArray.length > 0) {
      filter.tags = { $in: tagArray };
    }

    const courses = await Course.find(filter)
      .populate('category')
      .populate('tags')
      .populate({
        path: 'authors',
        select: '-password',
      })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    if (!courses) {
      res.status(404).json({ message: 'Курсы не найдены' });
      return;
    }

    const totalCourses = courses.length;

    res.status(200).json({
      data: courses,
      pagination: {
        total: totalCourses,
        page,
        limit,
        pages: Math.ceil(totalCourses / limitNumber),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getStudentsByCourse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { slug_course } = req.params;

    const course = await Course.findOne({ slug: slug_course });

    if (!course) {
      res.status(404).json({ error: 'Курс не найден' });
      return;
    }

    const students = await Student.find({ access_courses: course.id });

    res.status(200).json({ data: students });
  } catch (error) {
    next(error);
  }
};

const getCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug_course } = req.params;

    const course = await Course.findOne({ slug: slug_course })
      .populate('category')
      .populate('tags')
      .populate({
        path: 'authors',
        select: '-password',
      });

    if (!course) {
      res.status(404).json({ error: 'Курс не найден' });
      return;
    }

    res.status(200).json({ data: course });
  } catch (error) {
    next(error);
  }
};

const createCourse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, authors, description, price, level, category_id, tags } =
      createCourseSchema.parse(req.body);

    const category = await Category.findById(category_id);
    if (!category) {
      res
        .status(404)
        .json({ error: `Категория не найдена по ID ${category_id}` });
      return;
    }

    const invalidAuthors: { authorId: string; error: string }[] = [];
    const resultAuthors: string[] = [];

    for (const authorId of authors) {
      const author = await Teacher.findById(authorId);
      if (!author) {
        invalidAuthors.push({ authorId, error: 'Автор не найден' });
      } else {
        resultAuthors.push(authorId);
      }
    }

    if (invalidAuthors.length > 0) {
      res.status(400).json({ errors: invalidAuthors });
      return;
    }

    const invalidTags: { tagId: string; error: string }[] = [];
    const resultTags: string[] = [];

    if (tags) {
      for (const tagId of tags) {
        const tag = await Tag.findById(tagId);
        if (!tag) {
          invalidTags.push({ tagId, error: 'Тег не найден' });
        } else {
          resultTags.push(tagId);
        }
      }

      if (invalidTags.length > 0) {
        res.status(400).json({ errors: invalidTags });
        return;
      }
    }

    const course = await Course.create({
      title,
      description,
      price,
      level,
      category: category_id,
      tags: resultTags,
      authors: resultAuthors,
    });

    res.status(201).json({ success: true, slug_course: course.slug });
  } catch (err) {
    next(err);
  }
};

const updateCourse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      title,
      description,
      price,
      level,
      category_id,
      tags,
      isPublish,
      authors,
    } = updateCourseSchema.parse(req.body);
    const { slug_course } = req.params;

    const updateData = {} as CourseAttributes;

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (level !== undefined) updateData.level = level;
    if (category_id !== undefined) updateData.category = category_id;
    if (tags !== undefined) {
      const invalidTags: { tagId: string; error: string }[] = [];
      const resultTags: string[] = [];

      for (const tagId of tags) {
        const tag = await Tag.findById(tagId);
        if (!tag) {
          invalidTags.push({ tagId, error: 'Тег не найден' });
        } else {
          resultTags.push(tagId);
        }
      }

      if (invalidTags.length > 0) {
        res.status(400).json({ errors: invalidTags });
        return;
      }

      if (invalidTags.length > 0) {
        res.status(400).json({ errors: invalidTags });
        return;
      }

      updateData.tags = resultTags;
    }
    if (isPublish !== undefined) updateData.isPublish = isPublish;
    if (authors !== undefined) {
      const invalidAuthors: { authorId: string; error: string }[] = [];
      const resultAuthors: string[] = [];

      for (const authorId of authors) {
        const author = await Teacher.findById(authorId);
        if (!author) {
          invalidAuthors.push({ authorId, error: 'Автор не найден' });
        } else {
          resultAuthors.push(authorId);
        }
      }

      if (invalidAuthors.length > 0) {
        res.status(400).json({ errors: invalidAuthors });
        return;
      }

      updateData.authors = authors;
    }

    if (!(await Course.updateOne({ slug: slug_course }, updateData))) {
      res.status(404).json({ error: 'Курс не найден' });
      return;
    }

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

const getImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug_course } = req.params;

    const course = await Course.findOne({ slug: slug_course });

    if (!course) {
      res.status(404).json({ error: 'Курс не найден' });
      return;
    }
    if (!course.image || typeof course.image !== 'string') {
      res.status(404).json({ error: 'У курса нет корректного изображения' });
      return;
    }

    const filename = course.image;
    const imagePath = path.resolve('images', 'course', filename);

    res.sendFile(imagePath);
  } catch (error) {
    next(error);
  }
};

const updateImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug_course } = req.params;
    const file = req.file;

    if (!file) {
      res.status(400).json({
        error: 'Файл для обновления изображения курса не найден в теле запроса',
      });
      return;
    }

    const course = await Course.findOne({ slug: slug_course });

    if (!course) {
      res.status(404).json({ error: 'Курс не найден' });
      return;
    }

    if (course.image) {
      const oldFilePath = path.join(
        process.cwd(),
        'images',
        'course',
        course.image as string,
      );

      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    course.image = file.filename;
    await course.save();

    if (!(await transformCourseImage(file.path))) {
      res.status(500).json({ error: 'Ошибка преобразования изображения' });
      return;
    }

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

const deleteCourse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { slug_course } = req.params;

    if (!(await Course.deleteOne({ slug: slug_course }))) {
      res.status(404).json({ error: 'Курс не найден' });
      return;
    }

    res.status(204).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export {
  getCourses,
  getCourse,
  getImage,
  getStudentsByCourse,
  createCourse,
  updateCourse,
  updateImage,
  deleteCourse,
};
