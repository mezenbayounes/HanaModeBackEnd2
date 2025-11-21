import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import nodemailer from 'nodemailer';

export const listOrders = async (req: Request, res: Response) => {
  const orders = await Order.find().populate('items.product');
  res.json(orders);
};

export const getOrder = async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id).populate('items.product');
  if (!order) return res.status(404).json({ message: 'Not found' });
  res.json(order);
};

export const createOrder = async (req: Request, res: Response) => {
  {/*    
  const transporter = nodemailer.createTransport({
    service: 'smtp.gmail.com',
     secure: false, 
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!
    }
  });
   */}
  try {
    let total = 0;

    const itemsDetails: { name: string; quantity: number; size: string; color?: string; price: number }[] = [];
    for (const item of req.body.items) {
      const prod = await Product.findById(item.product);
      if (prod) {
        const price = prod.discountPrice ?? prod.price;
        total += price * item.quantity;
        itemsDetails.push({
          name: prod.name,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price,
        });
      }
    }

    const order = new Order({
      ...req.body,
      total,
      status: req.body.status || 'pending' // default pending
    });
 {/*  
    transporter.verify((error, success) => {
  if (error) {
    console.log('SMTP Error:', error);
  } else {
    console.log('SMTP is ready to send emails');
  }
});
    
    // Send order confirmation email
    const itemsHtml = itemsDetails.map(i => `<li>${i.name} - Qty: ${i.quantity}, Size: ${i.size}${i.color ? ', Color: ' + i.color : ''}, Price: $${i.price}</li>`).join('');
    await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: order.email,
  subject: 'Order Confirmation',
  html: `
    <p>Thank you for your order.</p>
    <p>Order ID: ${order._id}</p>
    <p>Total: $${order.total}</p>
    <p>Items:</p>
    <ul>${itemsHtml}</ul>
  `
});
*/}
await order.save();
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error });
  }
};
