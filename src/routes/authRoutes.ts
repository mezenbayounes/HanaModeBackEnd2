import express from 'express';
import { login, register,loginAdmin } from '../controllers/authController';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/loginAdmin', loginAdmin);

export default router;
