import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { Order } from '../models/Order';
import { AuthRequest } from '../middleware/authMiddleware';
import { Op } from 'sequelize';

export const listProducts = async (req: AuthRequest, res: Response) => {
  try {
    // If user is authenticated (admin), show all products
    // Otherwise, show only non-hidden products
    const isAdmin = req.user; // req.user is set by auth middleware
    const whereClause = isAdmin ? {} : { isHidden: { [Op.ne]: true } };

    const products = await Product.findAll({ where: whereClause });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
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

    const product = await Product.create({
      ...req.body,
      sizes,
      color,
      images: imagePaths
    });

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

    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.update(updatedData);

    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
};


export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id);

    // Check if product is used in any orders
    // Since items is a JSON field, we need to check all orders
    const allOrders = await Order.findAll();
    const ordersWithProduct = allOrders.find(order =>
      order.items.some((item: any) => item.product === productId)
    );

    if (ordersWithProduct) {
      return res.status(400).json({
        error: 'PRODUCT_IN_ORDERS',
        message: 'Cannot delete product. It is used in one or more orders.'
      });
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};

export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;

    const products = await Product.findAll({ where: { category } });

    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found for this category' });
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products by category', error });
  }
};

export const toggleProductVisibility = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Toggle the isHidden field
    product.isHidden = !product.isHidden;
    await product.save();

    res.json({
      message: `Product ${product.isHidden ? 'hidden' : 'shown'} successfully`,
      product
    });
  } catch (error) {
    res.status(500).json({ message: 'Error toggling product visibility', error });
  }
};
