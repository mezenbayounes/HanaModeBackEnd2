import { Router } from 'express';
import * as controller from '../controllers/orderController';
import { authenticateToken, optionalAuth } from '../middleware/authMiddleware';

const router = Router();


router.get('/', controller.listOrders);
router.get('/user/my-orders', authenticateToken, controller.getUserOrders); // must be before /:id
router.get('/:id', controller.getOrder);
router.post('/', optionalAuth, controller.createOrder); // optionalAuth allows guest and logged-in users
router.patch('/:id/status', controller.updateOrderStatus);

export default router;