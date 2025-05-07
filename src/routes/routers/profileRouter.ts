import { Router } from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';
import {
  getProfile,
  deleteProfile,
  changeFavoriteCourse,
} from '../../controllers/profileController';

const router = Router();

router.get('/', authMiddleware, getProfile);
router.delete('/', authMiddleware, deleteProfile);
router.patch('/add-favorite-service', authMiddleware, changeFavoriteCourse());
router.patch(
  '/remove-favorite-service',
  authMiddleware,
  changeFavoriteCourse(false),
);

export const profileRoutes = router;
