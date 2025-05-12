import { Router } from 'express';
import {
  changeBalance,
  changeFavoriteCourse,
  changeLessonComplete,
  getProgressCourse,
  getStudents,
  signUpCourse,
} from '../../controllers/studentController';
import {
  accessStudentMiddleware,
  accessTeacherMiddleware,
  authMiddleware,
} from '../../middleware/authMiddleware';

const router = Router();

router.get('/', getStudents);
router.patch(
  '/progress/:slug_course',
  authMiddleware,
  accessStudentMiddleware,
  getProgressCourse,
);
router.patch(
  '/add-favorite-courses/:slug_course',
  authMiddleware,
  accessStudentMiddleware,
  changeFavoriteCourse(),
);
router.patch(
  '/remove-favorite-courses/:slug_course',
  authMiddleware,
  accessStudentMiddleware,
  changeFavoriteCourse(false),
);
router.patch(
  '/signup-course/:slug_course',
  authMiddleware,
  accessStudentMiddleware,
  signUpCourse,
);
router.patch(
  '/add-complete-lesson/:slug_lesson',
  authMiddleware,
  accessStudentMiddleware,
  changeLessonComplete(),
);
router.patch(
  '/remove-complete-lesson/:slug_lesson',
  authMiddleware,
  accessStudentMiddleware,
  changeLessonComplete(false),
);
router.patch(
  '/:student_id/balance',
  authMiddleware,
  accessTeacherMiddleware,
  changeBalance,
);

export const studentRoutes = router;
