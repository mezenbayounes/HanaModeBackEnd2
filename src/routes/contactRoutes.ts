import { Router } from 'express';
import { createContactMessage, listContactMessages } from '../controllers/contactController';

const router = Router();

router.post('/', createContactMessage);
router.get('/', listContactMessages);

export default router;

