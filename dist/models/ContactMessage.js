"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactMessage = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
class ContactMessage extends sequelize_1.Model {
}
exports.ContactMessage = ContactMessage;
ContactMessage.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    phone: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
    },
    message: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('new', 'read'),
        allowNull: false,
        defaultValue: 'new',
    },
}, {
    sequelize: db_1.default,
    tableName: 'contact_messages',
    timestamps: true,
});
//# sourceMappingURL=ContactMessage.js.map