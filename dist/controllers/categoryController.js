"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getCategory = exports.getCategories = exports.createCategory = void 0;
const Category_1 = require("../models/Category");
const sequelize_1 = require("sequelize");
// CREATE category
const createCategory = async (req, res) => {
    try {
        const { name, image, isHidden } = req.body;
        const file = req.file;
        if (!name) {
            return res.status(400).json({ message: 'Category name is required' });
        }
        const exists = await Category_1.Category.findOne({ where: { name } });
        if (exists)
            return res.status(400).json({ message: 'Category already exists' });
        const imagePath = file ? `/uploads/${file.filename}` : image || '';
        const category = await Category_1.Category.create({
            name,
            image: imagePath,
            isHidden: isHidden === 'true' || isHidden === true
        });
        res.status(201).json(category);
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
};
exports.createCategory = createCategory;
// GET all categories
const getCategories = async (req, res) => {
    try {
        const { isAdmin } = req.query;
        const whereClause = isAdmin === 'true' ? {} : { isHidden: { [sequelize_1.Op.ne]: true } };
        const categories = await Category_1.Category.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']]
        });
        res.json(categories);
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
};
exports.getCategories = getCategories;
// GET single category
const getCategory = async (req, res) => {
    try {
        const category = await Category_1.Category.findByPk(req.params.id);
        if (!category)
            return res.status(404).json({ message: "Category not found" });
        res.json(category);
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
};
exports.getCategory = getCategory;
// UPDATE category
const updateCategory = async (req, res) => {
    try {
        const { name, image, isHidden } = req.body;
        const file = req.file;
        const updatePayload = {};
        if (typeof name === 'string' && name.trim().length > 0)
            updatePayload.name = name;
        if (file) {
            updatePayload.image = `/uploads/${file.filename}`;
        }
        else if (typeof image === 'string') {
            updatePayload.image = image;
        }
        if (isHidden !== undefined) {
            updatePayload.isHidden = isHidden === 'true' || isHidden === true;
        }
        const category = await Category_1.Category.findByPk(req.params.id);
        if (!category)
            return res.status(404).json({ message: 'Category not found' });
        await category.update(updatePayload);
        res.json(category);
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
};
exports.updateCategory = updateCategory;
// DELETE category
const deleteCategory = async (req, res) => {
    try {
        const category = await Category_1.Category.findByPk(req.params.id);
        if (!category)
            return res.status(404).json({ message: "Category not found" });
        await category.destroy();
        res.json({ message: "Category deleted" });
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
};
exports.deleteCategory = deleteCategory;
//# sourceMappingURL=categoryController.js.map