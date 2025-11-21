import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  image?: string;
  isHidden?: boolean;
}

const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    image: { type: String, default: '' },
    isHidden: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Category = mongoose.model<ICategory>('Category', CategorySchema);
