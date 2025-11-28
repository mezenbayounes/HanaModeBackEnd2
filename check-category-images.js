// Quick script to check what image paths are stored in the database
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false
    }
);

async function checkImages() {
    try {
        const [results] = await sequelize.query('SELECT id, name, image FROM categories');

        console.log('\n=== CATEGORY IMAGES IN DATABASE ===\n');
        results.forEach(cat => {
            console.log(`ID: ${cat.id}`);
            console.log(`Name: ${cat.name}`);
            console.log(`Image Path: "${cat.image}"`);
            console.log(`Full URL would be: http://localhost:4000${cat.image}`);
            console.log('---');
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkImages();
