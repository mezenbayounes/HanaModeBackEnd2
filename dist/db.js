"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sequelize = new sequelize_1.Sequelize(process.env.DB_NAME || 'hanamode_db', process.env.DB_USER || 'root', process.env.DB_PASSWORD || '', {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT),
    dialect: 'mysql',
    logging: false, // Set to console.log to see SQL queries
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to MySQL database');
        // Sync all models with database
        await sequelize.sync({ alter: true }); // Use alter: true for development, force: false for production
        console.log('Database synchronized');
    }
    catch (err) {
        console.error('MySQL connection error:', err);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
exports.default = sequelize;
//# sourceMappingURL=db.js.map