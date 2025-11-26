import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const googleConfig = {
    clientID: process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'YOUR_GOOGLE_CLIENT_SECRET',
    callbackURL: `${process.env.BASE_URL_BACKEND}/api/auth/google/callback`,
};

console.log('Google Strategy Config:', { ...googleConfig, clientSecret: '***' });

passport.use(
    new GoogleStrategy(
        googleConfig,
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists
                let user = await User.findOne({ where: { googleId: profile.id } });

                if (user) {
                    return done(null, user);
                }

                // Check if user exists with same email
                const email = profile.emails?.[0]?.value;
                if (email) {
                    user = await User.findOne({ where: { email } });
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

                user = await User.create({
                    googleId: profile.id,
                    email: email, // Now TypeScript knows email is definitely a string
                    name: profile.displayName,
                    role: 'user',
                    favorites: [],
                    isVerified: true, // Google verifies email
                });

                done(null, user);
            } catch (error) {
                done(error, undefined);
            }
        }
    )
);

export default passport;
