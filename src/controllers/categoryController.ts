import { Request, Response } from 'express';
import { Category } from '../models/Category';
import { Op } from 'sequelize';

// CREATE category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, image, isHidden } = req.body;
    const file = req.file as Express.Multer.File | undefined;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const exists = await Category.findOne({ where: { name } });
    if (exists) return res.status(400).json({ message: 'Category already exists' });

    const imagePath = file ? `/uploads/${file.filename}` : image || '';

    const category = await Category.create({
      name,
      image: imagePath,
      isHidden: isHidden === 'true' || isHidden === true
    });

    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// GET all categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const { isAdmin } = req.query;
    const whereClause = isAdmin === 'true' ? {} : { isHidden: { [Op.ne]: true } };
    const categories = await Category.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// GET single category
export const getCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// UPDATE category
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { name, image, isHidden } = req.body;
    const file = req.file as Express.Multer.File | undefined;

    const updatePayload: Partial<{ name: string; image: string; isHidden: boolean }> = {};
    if (typeof name === 'string' && name.trim().length > 0) updatePayload.name = name;

    if (file) {
      updatePayload.image = `/uploads/${file.filename}`;
    } else if (typeof image === 'string') {
      updatePayload.image = image;
    }

    if (isHidden !== undefined) {
      updatePayload.isHidden = isHidden === 'true' || isHidden === true;
    }

    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    await category.update(updatePayload);

    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// DELETE category
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    await category.destroy();

    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
