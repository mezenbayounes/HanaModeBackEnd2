# HanaMori Backend - MySQL Migration

This backend has been migrated from MongoDB to MySQL using Sequelize ORM.

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server (v5.7 or higher)
- npm or yarn

## Installation Steps

### 1. Install MySQL

If you don't have MySQL installed:

**Windows:**
- Download MySQL from [https://dev.mysql.com/downloads/installer/](https://dev.mysql.com/downloads/installer/)
- Install MySQL Server and MySQL Workbench
- Set a root password during installation

**Mac:**
```bash
brew install mysql
brew services start mysql
```

**Linux:**
```bash
sudo apt-get update
sudo apt-get install mysql-server
sudo systemctl start mysql
```

### 2. Create Database

Login to MySQL:
```bash
mysql -u root -p
```

Create the database:
```sql
CREATE DATABASE HanaMori_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 3. Configure Environment Variables

Create a `.env` file in the backend root directory with the following content:

```env
# Database Configuration (MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=HanaMori_db
DB_USER=root
DB_PASSWORD=your_mysql_password

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Email Configuration
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_app_specific_password

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Backend & Frontend URLs
BASE_URL_BACKEND=http://localhost:3000
FRONTEND_URL=http://localhost:5173
```

**Important:** Replace the placeholder values with your actual credentials.

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the Backend

```bash
npm run dev
```

The backend will:
1. Connect to MySQL
2. Automatically create/update all tables based on your models
3. Start listening on port 3000 (or your configured port)

## Database Schema

The following tables will be created automatically:

- **users** - User accounts with authentication
- **products** - Product catalog
- **categories** - Product categories
- **orders** - Customer orders
- **contact_messages** - Contact form submissions

## Migration from MongoDB

### Key Changes:

1. **IDs**: MongoDB ObjectIds (`_id`) → MySQL auto-incrementing integers (`id`)
2. **Queries**: 
   - `find()` → `findAll()`
   - `findById()` → `findByPk()`
   - `findOne({ field: value })` → `findOne({ where: { field: value } })`
   - `save()` → `create()` or `update()`
3. **Populated Fields**: Manual population instead of Mongoose populate
4. **Validation**: Integer ID validation instead of ObjectId validation

### Data Migration

If you need to migrate existing data from MongoDB to MySQL:

1. Export data from MongoDB:
```bash
mongoexport --db=HanaMori_db --collection=users --out=users.json
mongoexport --db=HanaMori_db --collection=products --out=products.json
# etc...
```

2. Create a migration script to import the data into MySQL (accounting for ID changes)

## Troubleshooting

### MySQL Connection Issues

If you get "ER_NOT_SUPPORTED_AUTH_MODE":
```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
FLUSH PRIVILEGES;
```

### Table Sync Issues

If tables aren't syncing correctly, you can force a resync (⚠️ this will drop all data):
```javascript
// In src/db.ts, change:
await sequelize.sync({ alter: true });
// to:
await sequelize.sync({ force: true }); // WARNING: This drops all tables!
```

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server

## Production Deployment

For production:
1. Set `NODE_ENV=production`
2. Use connection pooling (already configured)
3. Set `logging: false` in Sequelize config
4. Use SSL for MySQL connections if remote
5. Never use `sync({ force: true })` in production

## Support

For issues or questions, contact the development team.