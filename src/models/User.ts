import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    passwordHash?: string; // Optional for Google OAuth users
    googleId?: string; // Google OAuth ID
    name?: string;
    address?: string;
    role: 'admin' | 'user';
    favorites: mongoose.Types.ObjectId[];
    createdAt: Date;
    resetPasswordOTP?: string;
    resetPasswordOTPExpires?: Date;
    verificationOTP?: string;
    verificationOTPExpires?: Date;
    isVerified: boolean;
}

const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String }, // Not required for Google OAuth
    googleId: { type: String }, // Google OAuth ID
    name: { type: String },
    address: { type: String },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    favorites: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    createdAt: { type: Date, default: Date.now },
    resetPasswordOTP: { type: String },
    resetPasswordOTPExpires: { type: Date },
    verificationOTP: { type: String },
    verificationOTPExpires: { type: Date },
    isVerified: { type: Boolean, default: false },
});

export default mongoose.model<IUser>('User', UserSchema);
