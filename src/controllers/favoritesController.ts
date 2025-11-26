import { Request, Response } from 'express';
import User from '../models/User';
import { Product } from '../models/Product';
import { Op } from 'sequelize';

// Add product to favorites
export const addToFavorites = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const { productId } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if product exists
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let currentFavorites = user.favorites;
        if (typeof currentFavorites === 'string') {
            try {
                currentFavorites = JSON.parse(currentFavorites);
            } catch (e) {
                currentFavorites = [];
            }
        }
        if (!Array.isArray(currentFavorites)) {
            currentFavorites = [];
        }

        // Check if already in favorites
        if (currentFavorites.includes(Number(productId))) {
            return res.status(400).json({ message: 'Product already in favorites' });
        }

        user.favorites = [...currentFavorites, Number(productId)];
        await user.save();

        res.json({ message: 'Product added to favorites', favorites: user.favorites });
    } catch (error) {
        console.error('Add to favorites error:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Remove product from favorites
export const removeFromFavorites = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const { productId } = req.params;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let currentFavorites = user.favorites;
        if (typeof currentFavorites === 'string') {
            try {
                currentFavorites = JSON.parse(currentFavorites);
            } catch (e) {
                currentFavorites = [];
            }
        }
        if (!Array.isArray(currentFavorites)) {
            currentFavorites = [];
        }

        user.favorites = currentFavorites.filter(id => id !== Number(productId));
        await user.save();

        res.json({ message: 'Product removed from favorites', favorites: user.favorites });
    } catch (error) {
        console.error('Remove from favorites error:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get user's favorites
export const getFavorites = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let favoriteIds = user.favorites;

        // Ensure favoriteIds is an array
        if (typeof favoriteIds === 'string') {
            try {
                favoriteIds = JSON.parse(favoriteIds);
            } catch (e) {
                console.error('Error parsing favorites JSON:', e);
                favoriteIds = [];
            }
        }

        // If not an array or empty, return empty list
        if (!Array.isArray(favoriteIds) || favoriteIds.length === 0) {
            return res.json({ favorites: [] });
        }

        // Manually populate favorites
        const favoriteProducts = await Product.findAll({
            where: {
                id: {
                    [Op.in]: favoriteIds
                }
            }
        });

        // Parse JSON fields for each product
        const parsedProducts = favoriteProducts.map(product => {
            const productData = product.toJSON();
            return {
                ...productData,
                images: typeof productData.images === 'string' ? JSON.parse(productData.images) : productData.images,
                sizes: typeof productData.sizes === 'string' ? JSON.parse(productData.sizes) : productData.sizes,
                color: typeof productData.color === 'string' ? JSON.parse(productData.color) : productData.color,
                price: typeof productData.price === 'string' ? parseFloat(productData.price) : productData.price,
                discountPrice: productData.discountPrice ? (typeof productData.discountPrice === 'string' ? parseFloat(productData.discountPrice) : productData.discountPrice) : undefined,
            };
        });

        res.json({ favorites: parsedProducts });
    } catch (error) {
        console.error('Get favorites error:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Check if product is in favorites
export const checkFavorite = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const { productId } = req.params;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isFavorite = user.favorites.includes(Number(productId));
        res.json({ isFavorite });
    } catch (error) {
        console.error('Check favorite error:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
