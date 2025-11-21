import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  category: string;
  description: string;
  price: number;
  discountPrice?: number;
  inStock: boolean;
  images: string[];

  // UPDATED: size-specific colors
  sizes: {
    size: string;
    inStock: boolean;
    colors: { name: string; code: string }[];
  }[];

  // Optional global color list (you can keep or remove)
  color?: { name: string; code: string }[];

  featured?: boolean;
  bestSeller?: boolean;
}

const ColorSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true }
});

const SizeSchema = new Schema({
  size: {
    type: String,
    required: true
  },
  inStock: {
    type: Boolean,
    default: true
  },
  colors: [ColorSchema] // each size has its own colors
});

const ProductSchema: Schema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    category: {
      type: String,
     
      required: true
    },
    description: String,

    price: { type: Number, required: true },
    discountPrice: Number,
    inStock: { type: Boolean, default: true },

    images: [String],

    // UPDATED ↓
    sizes: [SizeSchema],

    // optional global full color list
    color: [ColorSchema],

    featured: Boolean,
    bestSeller: Boolean
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
