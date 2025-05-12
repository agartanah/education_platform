import { Router } from 'express';
import {
  changeOrder,
  createLesson,
  deleteLesson,
  getLesson,
  getLessons,
  getVideo,
  updateLesson,
  updateVideo,
} from '../../controllers/lessonController';
import {
  accessTeacherMiddleware,
  checkLessonBelongCourse,
} from '../../middleware/authMiddleware';
import uploaders from '../../utils/multer';
import { commentRoutes } from './commentRouter';

const router = Router({ mergeParams: true });

router.get('/', getLessons);
router.post('/', accessTeacherMiddleware, createLesson);
router.use('/:slug_lesson', checkLessonBelongCourse);
router.get('/:slug_lesson', getLesson);
router.patch('/:slug_lesson', accessTeacherMiddleware, updateLesson);
router.delete('/:slug_lesson', accessTeacherMiddleware, deleteLesson);
router.patch(
  '/:slug_lesson/change-order',
  accessTeacherMiddleware,
  changeOrder,
);
router.use('/:slug_lesson/comments', commentRoutes);
router.get('/:slug_lesson/video', getVideo);
router.patch('/:slug_lesson/video', uploaders.lessons, updateVideo);

export const lessonRoutes = router;
