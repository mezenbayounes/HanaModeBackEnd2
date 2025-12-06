import { Router } from 'express';
import { createContactMessage, listContactMessages, deleteContactMessage } from '../controllers/contactController';

const router = Router();

router.post('/', createContactMessage);
router.get('/', listContactMessages);
router.delete('/:id', deleteContactMessage);

export default router;

