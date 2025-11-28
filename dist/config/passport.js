"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const User_1 = __importDefault(require("../models/User"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const googleConfig = {
    clientID: process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'YOUR_GOOGLE_CLIENT_SECRET',
    callbackURL: `${process.env.BASE_URL_BACKEND}/api/auth/google/callback`,
};
console.log('Google Strategy Config:', { ...googleConfig, clientSecret: '***' });
passport_1.default.use(new passport_google_oauth20_1.Strategy(googleConfig, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists
        let user = await User_1.default.findOne({ where: { googleId: profile.id } });
        if (user) {
            return done(null, user);
        }
        // Check if user exists with same email
        const email = profile.emails?.[0]?.value;
        if (email) {
            user = await User_1.default.findOne({ where: { email } });
            if (user) {
                // Link google account to existing email account
                user.googleId = profile.id;
                user.isVerified = true; // Google verifies email
                await user.save();
                return done(null, user);
            }
        }
        // Create new user
        if (!email) {
            return done(new Error('Email not provided by Google'), undefined);
        }
        user = await User_1.default.create({
            googleId: profile.id,
            email: email, // Now TypeScript knows email is definitely a string
            name: profile.displayName,
            role: 'user',
            favorites: [],
            isVerified: true, // Google verifies email
        });
        done(null, user);
    }
    catch (error) {
        done(error, undefined);
    }
}));
exports.default = passport_1.default;
//# sourceMappingURL=passport.js.map