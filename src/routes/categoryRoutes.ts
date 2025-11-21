import { Router } from 'express';
import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController';
import { upload } from '../middleware/upload';

const router = Router();

// CRUD Routes
router.post('/', upload.single('image'), createCategory);
router.get('/', getCategories);
router.get('/:id', getCategory);
router.put('/:id', upload.single('image'), updateCategory);
router.delete('/:id', deleteCategory);

export default router;
