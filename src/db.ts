import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'hanamode_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT!),
    dialect: 'mysql',
    logging: false, // Set to console.log to see SQL queries
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to MySQL database');

    // Sync all models with database
    await sequelize.sync({ alter: true }); // Use alter: true for development, force: false for production
    console.log('Database synchronized');
  } catch (err) {
    console.error('MySQL connection error:', err);
    process.exit(1);
  }
};

export default sequelize;