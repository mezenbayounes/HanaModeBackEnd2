import mongoose, { Schema, Document } from 'mongoose';
import { IProduct } from './Product';

export interface IOrderItem {
  product: mongoose.Schema.Types.ObjectId | IProduct;
  quantity: number;
  size: string;
  color?: string; // optional color
}

export interface IOrder extends Document {
 // email: string;
  items: IOrderItem[];
  customerDetails: {
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
  };
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'; // new field
  orderDate: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  size: { type: String, required: true },
  color: { type: String } // optional
});

const OrderSchema: Schema = new Schema<IOrder>({
 // email: { type: String, required: true },
  items: [OrderItemSchema],
  customerDetails: {
    firstName: String,
    lastName: String,
    address: String,
    phone: String
  },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  orderDate: { type: Date, default: Date.now }
}, { timestamps: true });

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
