import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../db';

export interface IUser {
    id: number;
    email: string;
    passwordHash?: string;
    googleId?: string;
    name?: string;
    address?: string;
    role: 'admin' | 'user';
    favorites: number[]; // Array of product IDs
    resetPasswordOTP?: string;
    resetPasswordOTPExpires?: Date;
    verificationOTP?: string;
    verificationOTPExpires?: Date;
    isVerified: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<IUser, 'id' | 'passwordHash' | 'googleId' | 'name' | 'address' | 'favorites' | 'resetPasswordOTP' | 'resetPasswordOTPExpires' | 'verificationOTP' | 'verificationOTPExpires' | 'isVerified' | 'createdAt' | 'updatedAt'> { }

class User extends Model<IUser, UserCreationAttributes> implements IUser {
    public id!: number;
    public email!: string;
    public passwordHash?: string;
    public googleId?: string;
    public name?: string;
    public address?: string;
    public role!: 'admin' | 'user';
    public favorites!: number[];
    public resetPasswordOTP?: string;
    public resetPasswordOTPExpires?: Date;
    public verificationOTP?: string;
    public verificationOTPExpires?: Date;
    public isVerified!: boolean;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        passwordHash: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        googleId: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        role: {
            type: DataTypes.ENUM('admin', 'user'),
            allowNull: false,
            defaultValue: 'user',
        },
        favorites: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
        },
        resetPasswordOTP: {
            type: DataTypes.STRING(10),
            allowNull: true,
        },
        resetPasswordOTPExpires: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        verificationOTP: {
            type: DataTypes.STRING(10),
            allowNull: true,
        },
        verificationOTPExpires: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        sequelize,
        tableName: 'users',
        timestamps: true,
    }
);

export default User;
