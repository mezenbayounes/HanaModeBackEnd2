import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './db';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import categoryRoutes from './routes/categoryRoutes';
import contactRoutes from './routes/contactRoutes';
import authRoutes from './routes/authRoutes';
import favoritesRoutes from './routes/favoritesRoutes';
import { errorHandler } from './middleware/errorHandler';

import passport from 'passport';
import './config/passport';

dotenv.config();
const app = express();
const port = process.env.PORT ;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(passport.initialize());

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/categories', categoryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoritesRoutes);

app.get('/', (_, res) => res.send('Hana Mode API'));
app.use(errorHandler);

connectDB().then(() => app.listen(port, () => console.log(`Server running on http://localhost:${port}`)));