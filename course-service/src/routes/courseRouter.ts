import { Router } from 'express';
import {
  createCourse,
  deleteCourse,
  getCourse,
  getCourseCreationStatus,
  getCourses,
  getImage,
  updateCourse,
  updateImage,
} from '../controllers/courseController';
import {
  authMiddleware,
  accessTeacherMiddleware,
  accessCourseMiddleware,
} from '../middleware/authMiddleware';
import uploaders from '../utils/multer';
import { lessonRoutes } from './lessonRouter';

const router = Router();

router.get('/', getCourses);
router.post('/', authMiddleware, createCourse);
router.get(
  '/creation-status/:requestId',
  authMiddleware,
  getCourseCreationStatus
);
router.get('/:slug_course', getCourse);
router.patch(
  '/:slug_course',
  authMiddleware,
  accessTeacherMiddleware,
  updateCourse
);
router.delete(
  '/:slug_course',
  authMiddleware,
  accessTeacherMiddleware,
  deleteCourse
);
router.use(
  '/:slug_course/lessons',
  authMiddleware,
  accessCourseMiddleware,
  lessonRoutes
);
router.get('/:slug_course/image', getImage);
router.patch(
  '/:slug_course/image',
  authMiddleware,
  accessTeacherMiddleware,
  uploaders.courses,
  updateImage
);

export const courseRoutes = router;
