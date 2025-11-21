import { Request, Response } from 'express';
import { Category } from '../models/Category';

// CREATE category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, image, isHidden } = req.body;
    const file = req.file as Express.Multer.File | undefined;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const exists = await Category.findOne({ name });
    if (exists) return res.status(400).json({ message: 'Category already exists' });

    const imagePath = file ? `/uploads/${file.filename}` : image || '';

    const category = new Category({
      name,
      image: imagePath,
      isHidden: isHidden === 'true' || isHidden === true
    });
    await category.save();

    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// GET all categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const { isAdmin } = req.query;
    const filter = isAdmin === 'true' ? {} : { isHidden: { $ne: true } };
    const categories = await Category.find(filter).sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// GET single category
export const getCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
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

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updatePayload,
      { new: true }
    );

    if (!category) return res.status(404).json({ message: 'Category not found' });

    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// DELETE category
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
