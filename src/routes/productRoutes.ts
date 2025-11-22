import express from 'express';
import {
    createProduct, listProducts, getProduct, updateProduct, deleteProduct, getProductsByCategory, toggleProductVisibility
} from '../controllers/productController';
import { upload } from '../middleware/upload';
import { optionalAuth } from '../middleware/authMiddleware';



const router = express.Router();
// Upload multiple images when creating a product
router.post('/', upload.array('images', 5), createProduct);
router.get('/', optionalAuth, listProducts);
router.patch('/:id/toggle-visibility', toggleProductVisibility);
router.get('/:id', getProduct);
router.put('/:id', upload.array('images', 5), updateProduct);
router.delete('/:id', deleteProduct);
router.get('/category/:category', getProductsByCategory);


export default router;