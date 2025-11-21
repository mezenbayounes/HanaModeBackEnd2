import express from 'express';
import { createProduct, listProducts, getProduct, updateProduct, deleteProduct ,  getProductsByCategory
} from '../controllers/productController';
import { upload } from '../middleware/upload';



const router = express.Router();
// Upload multiple images when creating a product
router.post('/', upload.array('images', 5), createProduct);
router.get('/', listProducts);
router.get('/:id', getProduct);
router.put('/:id', upload.array('images', 5), updateProduct);
router.delete('/:id', deleteProduct);
router.get('/category/:category', getProductsByCategory); 


export default router;