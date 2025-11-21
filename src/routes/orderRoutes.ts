import { Router } from 'express';
import * as controller from '../controllers/orderController';

const router = Router();

router.get('/', controller.listOrders);
router.get('/:id', controller.getOrder);
router.post('/', controller.createOrder);

export default router;