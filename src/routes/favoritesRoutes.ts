import express from 'express';
import { addToFavorites, removeFromFavorites, getFavorites, checkFavorite } from '../controllers/favoritesController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// All routes require authentication
router.post('/', authenticateToken, addToFavorites);
router.delete('/:productId', authenticateToken, removeFromFavorites);
router.get('/', authenticateToken, getFavorites);
router.get('/check/:productId', authenticateToken, checkFavorite);

export default router;
