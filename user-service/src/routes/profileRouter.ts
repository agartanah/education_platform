import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { getProfile, deleteProfile } from '../controllers/profileController';

const router = Router();

router.get('/', authMiddleware, getProfile);
router.delete('/', authMiddleware, deleteProfile);

export const profileRoutes = router;
