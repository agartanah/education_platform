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
router.post('/', authMiddleware, createCourse);
router.get('/:slug', getCourse);
router.patch('/:slug', authMiddleware, accessTeacherMiddleware, updateCourse);
router.delete('/:slug', authMiddleware, accessTeacherMiddleware, deleteCourse);
router.get('/:slug/image', getImage);
router.patch(
  '/:slug/image',
  authMiddleware,
  accessTeacherMiddleware,
  uploaders.courses,
  updateImage,
);

export const courseRoutes = router;
