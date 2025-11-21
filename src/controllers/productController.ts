import { Request, Response } from 'express';
import { Product } from '../models/Product';

export const listProducts = async (req: Request, res: Response) => {
  const products = await Product.find();
  res.json(products);
};

export const getProduct = async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    const imagePaths = files ? files.map(file => `/uploads/${file.filename}`) : [];

    // sizes arrives as JSON string → parse it
    let sizes = req.body.sizes;
    if (typeof sizes === 'string') {
      sizes = JSON.parse(sizes);
    }

    let color = req.body.color;
    if (typeof color === 'string') {
      color = JSON.parse(color);
    }

    const product = new Product({
      ...req.body,
      sizes,
      color,
      images: imagePaths
    });

    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error creating product', error });
  }
};


export const updateProduct = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    const imagePaths = files ? files.map(file => `/uploads/${file.filename}`) : [];

    let updatedData = { ...req.body };

    if (updatedData.sizes && typeof updatedData.sizes === 'string') {
      updatedData.sizes = JSON.parse(updatedData.sizes);
    }

    if (updatedData.color && typeof updatedData.color === 'string') {
      updatedData.color = JSON.parse(updatedData.color);
    }

    // Handle images: merge existing images with new uploads
    if (updatedData.existingImages && typeof updatedData.existingImages === 'string') {
      const existingImages = JSON.parse(updatedData.existingImages);
      // Combine existing images (that weren't removed) with new uploads
      updatedData.images = [...existingImages, ...imagePaths];
    } else if (imagePaths.length > 0) {
      // If no existingImages field, just use new uploads (replace all)
      updatedData.images = imagePaths;
    }
    // If neither existingImages nor new uploads, don't modify images field

    // Remove the existingImages field as it's not part of the schema
    delete updatedData.existingImages;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
};


export const deleteProduct = async (req: Request, res: Response) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};

export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;

    const products = await Product.find({ category });

    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found for this category' });
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products by category', error });
  }
};
