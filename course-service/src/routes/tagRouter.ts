import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  createTag,
  deleteTag,
  getTag,
  getTags,
  updateTag,
} from '../controllers/tagController';

const router = Router();

router.get('/', getTags);
router.post('/', authMiddleware, createTag);
router.get('/:tag_id', getTag);
router.patch('/:tag_id', authMiddleware, updateTag);
router.delete('/:tag_id', authMiddleware, deleteTag);

export const tagRoutes = router;
