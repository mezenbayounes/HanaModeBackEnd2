import { Request, Response } from 'express';
import User from '../models/User';
import { Product } from '../models/Product';

// Add product to favorites
export const addToFavorites = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const { productId } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if already in favorites
        if (user.favorites.includes(productId)) {
            return res.status(400).json({ message: 'Product already in favorites' });
        }

        user.favorites.push(productId);
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

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.favorites = user.favorites.filter(id => id.toString() !== productId);
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

        const user = await User.findById(userId).populate('favorites');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ favorites: user.favorites });
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

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isFavorite = user.favorites.some(id => id.toString() === productId);
        res.json({ isFavorite });
    } catch (error) {
        console.error('Check favorite error:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
