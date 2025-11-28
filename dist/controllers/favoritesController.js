"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkFavorite = exports.getFavorites = exports.removeFromFavorites = exports.addToFavorites = void 0;
const User_1 = __importDefault(require("../models/User"));
const Product_1 = require("../models/Product");
const sequelize_1 = require("sequelize");
// Add product to favorites
const addToFavorites = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId } = req.body;
        const user = await User_1.default.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Check if product exists
        const product = await Product_1.Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        let currentFavorites = user.favorites;
        if (typeof currentFavorites === 'string') {
            try {
                currentFavorites = JSON.parse(currentFavorites);
            }
            catch (e) {
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
    }
    catch (error) {
        console.error('Add to favorites error:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.addToFavorites = addToFavorites;
// Remove product from favorites
const removeFromFavorites = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId } = req.params;
        const user = await User_1.default.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        let currentFavorites = user.favorites;
        if (typeof currentFavorites === 'string') {
            try {
                currentFavorites = JSON.parse(currentFavorites);
            }
            catch (e) {
                currentFavorites = [];
            }
        }
        if (!Array.isArray(currentFavorites)) {
            currentFavorites = [];
        }
        user.favorites = currentFavorites.filter(id => id !== Number(productId));
        await user.save();
        res.json({ message: 'Product removed from favorites', favorites: user.favorites });
    }
    catch (error) {
        console.error('Remove from favorites error:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.removeFromFavorites = removeFromFavorites;
// Get user's favorites
const getFavorites = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User_1.default.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        let favoriteIds = user.favorites;
        // Ensure favoriteIds is an array
        if (typeof favoriteIds === 'string') {
            try {
                favoriteIds = JSON.parse(favoriteIds);
            }
            catch (e) {
                console.error('Error parsing favorites JSON:', e);
                favoriteIds = [];
            }
        }
        // If not an array or empty, return empty list
        if (!Array.isArray(favoriteIds) || favoriteIds.length === 0) {
            return res.json({ favorites: [] });
        }
        // Manually populate favorites
        const favoriteProducts = await Product_1.Product.findAll({
            where: {
                id: {
                    [sequelize_1.Op.in]: favoriteIds
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
    }
    catch (error) {
        console.error('Get favorites error:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getFavorites = getFavorites;
// Check if product is in favorites
const checkFavorite = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId } = req.params;
        const user = await User_1.default.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isFavorite = user.favorites.includes(Number(productId));
        res.json({ isFavorite });
    }
    catch (error) {
        console.error('Check favorite error:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.checkFavorite = checkFavorite;
//# sourceMappingURL=favoritesController.js.map