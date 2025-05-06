import { Router } from 'express';
import {
  createCourse,
  deleteCourse,
  getCourse,
  getCourses,
  getImage,
  updateCourse,
  updateImage,
} from '../../controllers/courseController';
import {
  authMiddleware,
  accessTeacherMiddleware,
} from '../../middleware/authMiddleware';
import uploaders from '../../utils/multer';

const router = Router();

router.get('/', getCourses);
router.post(
  '/',
  authMiddleware,
  accessTeacherMiddleware,
  uploaders.courses,
  createCourse,
);
router.get('/:course_id', getCourse);
router.patch(
  '/:course_id',
  authMiddleware,
  accessTeacherMiddleware,
  updateCourse,
);
router.delete(
  '/:course_id',
  authMiddleware,
  accessTeacherMiddleware,
  deleteCourse,
);
router.get('/:course_id/image', getImage);
router.patch(
  '/:course_id/image',
  authMiddleware,
  accessTeacherMiddleware,
  uploaders.courses,
  updateImage,
);

export const courseRoutes = router;
