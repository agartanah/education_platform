import { Router } from 'express';
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from '../../controllers/commentController';

const router = Router();

router.get('/', getComments);
router.post('/', createComment);
router.post('/:comment_id', updateComment);
router.delete('/:comment_id', deleteComment);

export const commentRoutes = router;
