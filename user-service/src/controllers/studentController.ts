import { NextFunction, Request, Response } from 'express';
import { Student, Course, Lesson } from '@shared/models';

const getStudents = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const students = await Student.find()
      .select('-password')
      .select('-balance');

    res.status(200).json({ data: students });
  } catch (error) {
    next(error);
  }
};

const changeFavoriteCourse = (add: boolean = true) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req;
      const { slug_course } = req.body;

      const course = await Course.findOne({ slug: slug_course });

      if (!course) {
        res.status(404).json({ error: 'Курс не найден' });
        return;
      }

      const student = await Student.findById(userId);

      if (!student) {
        res.status(404).json({ error: 'Студент не найден' });
        return;
      }

      const exists = student.favorite_courses.some(
        (id) => id.toString() === course.id.toString()
      );

      if (add && !exists) {
        student.favorite_courses.push(course.id);
      } else if (!add && exists) {
        student.favorite_courses = student.favorite_courses.filter(
          (id) => id.toString() !== course.id.toString()
        );
      }

      await student.save();

      res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  };
};

const changeBalance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { student_id } = req.params;
    const { balance } = req.body;

    const student = await Student.findById(student_id);

    if (!student) {
      res.status(404).json({ error: 'Студент не найден' });
      return;
    }

    student.balance = balance;
    await student.save();

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

const changeLessonComplete = (add: boolean = true) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req;
      const { slug_lesson } = req.body;

      const lesson = await Lesson.findOne({ slug: slug_lesson });

      if (!lesson) {
        res.status(404).json({ error: 'Урок не найден' });
        return;
      }

      const student = await Student.findById(userId);

      if (!student) {
        res.status(404).json({ error: 'Студент не найден' });
        return;
      }

      const exists = student.complete_lessons.some(
        (id) => id.toString() === lesson.id.toString()
      );

      if (add && !exists) {
        student.complete_lessons.push(lesson.id);
      } else if (!add && exists) {
        student.complete_lessons = student.complete_lessons.filter(
          (id) => id.toString() !== lesson.id.toString()
        );
      }

      await student.save();

      res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  };
};

const signUpCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req;
    const { slug_course } = req.params;

    const student = await Student.findById(userId);

    if (!student) {
      res.status(404).json({ error: 'Студент не найден' });
      return;
    }

    const course = await Course.findOne({ slug: slug_course });

    if (!course) {
      res.status(404).json({ error: 'Курс не найден' });
      return;
    }

    const balance = student.balance as number;
    const price = course.price as number;

    if (balance < price) {
      res.status(400).json({});
      return;
    }

    student.balance = balance - price;
    student.access_courses.push(course.id);

    await student.save();

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

const getProgressCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req;
    const { slug_course } = req.params;

    const course = await Course.findOne({ slug: slug_course });

    if (!course) {
      res.status(404).json({ error: 'Курс не найден' });
      return;
    }

    const totalLessons = await Lesson.countDocuments({ course: course.id });

    if (totalLessons === 0) {
      res.status(400).json({ error: 'У курса не найдены уроки' });
      return;
    }

    const student = await Student.findById(userId).select('complete_lessons');

    if (!student) {
      res.status(404).json({ error: 'Студент не найден' });
      return;
    }

    const completedLessons = await Lesson.countDocuments({
      _id: { $in: student.complete_lessons },
      course: course.id,
    });

    const progress = Math.round((completedLessons / totalLessons) * 100);

    res.status(200).json({ data: progress });
  } catch (error) {
    next(error);
  }
};

export {
  getStudents,
  getProgressCourse,
  changeBalance,
  changeFavoriteCourse,
  changeLessonComplete,
  signUpCourse,
};
