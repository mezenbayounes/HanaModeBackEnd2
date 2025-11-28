"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
class User extends sequelize_1.Model {
}
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    passwordHash: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    googleId: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    address: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    role: {
        type: sequelize_1.DataTypes.ENUM('admin', 'user'),
        allowNull: false,
        defaultValue: 'user',
    },
    favorites: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
    },
    resetPasswordOTP: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: true,
    },
    resetPasswordOTPExpires: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    verificationOTP: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: true,
    },
    verificationOTPExpires: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    isVerified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    sequelize: db_1.default,
    tableName: 'users',
    timestamps: true,
});
exports.default = User;
//# sourceMappingURL=User.js.map