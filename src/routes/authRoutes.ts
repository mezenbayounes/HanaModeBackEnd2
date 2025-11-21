import express from 'express';
import { login, register, loginAdmin, forgotPassword, resetPassword } from '../controllers/authController';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/loginAdmin', loginAdmin);

// Forgot/reset password
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
