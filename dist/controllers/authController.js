"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleCallback = exports.resetPassword = exports.forgotPassword = exports.loginAdmin = exports.login = exports.verifyEmail = exports.register = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
// adjust path if needed
const register = async (req, res) => {
    try {
        const { email, password, name, address, role } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const existingUser = await User_1.default.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(password, salt);
        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min
        const newUser = await User_1.default.create({
            email,
            passwordHash,
            name,
            address,
            role: role || 'user',
            favorites: [],
            isVerified: false,
            verificationOTP: otp,
            verificationOTPExpires: otpExpires
        });
        // Create transporter with debug
        const transporter = nodemailer_1.default.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '465'),
            secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false
            },
            logger: true, // ✅ log SMTP conversation
            debug: true // ✅ show detailed debug output
        });
        // Verify SMTP connection before sending
        transporter.verify((error, success) => {
            if (error) {
                console.error('SMTP verification failed:', error);
            }
            else {
                console.log('SMTP server is ready to send messages');
            }
        });
        await transporter.sendMail({
            from: 'HanaMode <contact@hanamode.tn>',
            to: email,
            subject: 'Verify your HanaMode Account',
            html: `<div style="font-family:Arial,sans-serif;font-size:16px;">
                <h2 style="color:#b48a78;">Welcome to HanaMode!</h2>
                <p>Please verify your email address to complete your registration.</p>
                <p>Your verification code is:</p>
                <div style="font-size:28px;font-weight:bold;letter-spacing:4px;color:#b48a78;">${otp}</div>
                <p style="margin-top:12px;">This code will expire in 15 minutes.</p>
            </div>`
        });
        res.status(201).json({
            message: 'Registration successful. Please check your email for verification code.',
            email: newUser.email,
            requiresVerification: true
        });
    }
    catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.register = register;
const verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }
        const user = await User_1.default.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        if (user.isVerified) {
            return res.status(400).json({ message: 'User already verified' });
        }
        if (!user.verificationOTP || !user.verificationOTPExpires) {
            return res.status(400).json({ message: 'Invalid verification request' });
        }
        if (user.verificationOTP !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        if (user.verificationOTPExpires < new Date()) {
            return res.status(400).json({ message: 'OTP expired' });
        }
        user.isVerified = true;
        user.verificationOTP = undefined;
        user.verificationOTPExpires = undefined;
        await user.save();
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.json({
            message: 'Email verified successfully',
            token,
            user: { id: user.id, email: user.email, name: user.name, role: user.role }
        });
    }
    catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.verifyEmail = verifyEmail;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const user = await User_1.default.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        if (!user.passwordHash) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        if (!user.isVerified) {
            return res.status(403).json({ message: 'Please verify your email address first', requiresVerification: true, email: user.email });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.login = login;
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const user = await User_1.default.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Only allow admin
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Admins only' });
        }
        if (!user.passwordHash) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        if (!user.isVerified) {
            return res.status(403).json({ message: 'Please verify your email address first', requiresVerification: true, email: user.email });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.json({
            token,
            user: { id: user.id, email: user.email, name: user.name, role: user.role }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.loginAdmin = loginAdmin;
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email)
            return res.status(400).json({ message: 'Email is required' });
        const user = await User_1.default.findOne({ where: { email } });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPasswordOTP = otp;
        user.resetPasswordOTPExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min
        await user.save();
        // Use same transporter config as register
        const transporter = nodemailer_1.default.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '465'),
            secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false
            },
            logger: true, // log SMTP conversation
            debug: true // show detailed debug output
        });
        // Verify SMTP connection before sending
        transporter.verify((error, success) => {
            if (error) {
                console.error('SMTP verification failed:', error);
            }
            else {
                console.log('SMTP server is ready to send messages');
            }
        });
        await transporter.sendMail({
            from: 'HanaMode <contact@hanamode.tn>',
            to: user.email,
            subject: 'HanaMode Password Reset OTP',
            html: `<div style="font-family:Arial,sans-serif;font-size:16px;">
                <h2 style="color:#b48a78;">Password Reset Request</h2>
                <p>Your OTP code is:</p>
                <div style="font-size:28px;font-weight:bold;letter-spacing:4px;color:#b48a78;">${otp}</div>
                <p style="margin-top:12px;">This code will expire in 15 minutes.</p>
                <p>If you did not request a password reset, please ignore this email.</p>
            </div>`
        });
        res.json({ message: 'OTP sent to your email' });
    }
    catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword, confirmPassword } = req.body;
        if (!email || !otp || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }
        const user = await User_1.default.findOne({ where: { email } });
        if (!user || !user.resetPasswordOTP || !user.resetPasswordOTPExpires) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }
        if (user.resetPasswordOTP !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        if (user.resetPasswordOTPExpires < new Date()) {
            return res.status(400).json({ message: 'OTP expired' });
        }
        // Hash new password
        const salt = await bcryptjs_1.default.genSalt(10);
        user.passwordHash = await bcryptjs_1.default.hash(newPassword, salt);
        user.resetPasswordOTP = undefined;
        user.resetPasswordOTPExpires = undefined;
        await user.save();
        res.json({ message: 'Password reset successful' });
    }
    catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.resetPassword = resetPassword;
const googleCallback = async (req, res) => {
    try {
        const user = req.user;
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        // Redirect to frontend with token
        // In production, use environment variable for frontend URL
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const userData = JSON.stringify({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        });
        const userBase64 = Buffer.from(userData).toString('base64');
        res.redirect(`${frontendUrl}/auth/google/callback?token=${token}&user=${userBase64}`);
    }
    catch (error) {
        console.error('Google callback error:', error);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(`${frontendUrl}/user-login?error=google_auth_failed`);
    }
};
exports.googleCallback = googleCallback;
//# sourceMappingURL=authController.js.map