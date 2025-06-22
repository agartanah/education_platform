import { Router } from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from '../../controllers/categoryController';

const router = Router();

router.get('/', getCategories);
router.post('/', authMiddleware, createCategory);
router.get('/:category_id', getCategory);
router.patch('/:category_id', authMiddleware, updateCategory);
router.delete('/:category_id', authMiddleware, deleteCategory);

export const categoryRoutes = router;
