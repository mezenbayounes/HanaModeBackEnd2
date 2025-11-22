// Update order status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = status;
    await order.save();
    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order status', error });
  }
};
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
  try {
    console.log('--- Incoming order request ---');
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    // 1️⃣ Extract email from top-level or customerDetails
    let email = req.body.email;
    if (!email && req.body.customerDetails && req.body.customerDetails.email) {
      email = req.body.customerDetails.email;
    }

    // 1️⃣ Validate email
    if (!email) {
      console.error('Missing email in order request:', req.body);
      return res.status(400).json({ message: 'Customer email is required' });
    }

    // 2️⃣ Calculate total and prepare item details
    let total = 0;
    const itemsDetails: { name: string; quantity: number; size: string; color?: string; price: number }[] = [];

    for (const item of req.body.items) {
      console.log('Processing item:', item);
      const prod = await Product.findById(item.product);
      if (!prod) {
        console.error('Product not found for item:', item);
      }
      if (prod) {
        let price = prod.discountPrice;
        if (price === undefined || price === null || price === 0) {
          price = prod.price;
        }
        total += price * item.quantity;
        // Use color name from item
        itemsDetails.push({
          name: prod.name,
          quantity: item.quantity,
          size: item.size,
          color: item.colorName || item.color || '-', // prefer colorName, fallback to color, then dash
          price,
        });
      }
    }

    // 3️⃣ Create and save order
    // 3️⃣ Create and save order
    const order = new Order({
      ...req.body,
      email, // always set email at top level for consistency
      total,
      status: req.body.status || 'pending', // default pending
    });
    await order.save();

    console.log('Order saved:', order);

    // 4️⃣ Prepare email content
    // Build a modern table for products
    const itemsHtml = `
      <table style="width:100%; border-collapse:collapse; margin-top:16px;">
        <thead>
          <tr style="background:#f5f5f5;">
            <th style="padding:10px; border-bottom:1px solid #eee; text-align:left;">Product</th>
            <th style="padding:10px; border-bottom:1px solid #eee; text-align:center;">Quantity</th>
            <th style="padding:10px; border-bottom:1px solid #eee; text-align:center;">Size</th>
            <th style="padding:10px; border-bottom:1px solid #eee; text-align:center;">Color</th>
            <th style="padding:10px; border-bottom:1px solid #eee; text-align:right;">Price (DNT)</th>
          </tr>
        </thead>
        <tbody>
          ${itemsDetails.map(i => `
            <tr style="border-bottom:1px solid #f0f0f0;">
              <td style="padding:12px 10px;">${i.name}</td>
              <td style="padding:12px 10px; text-align:center;">${i.quantity}</td>
              <td style="padding:12px 10px; text-align:center;">${i.size}</td>
              <td style="padding:12px 10px; text-align:center;">${i.color || '-'}</td>
              <td style="padding:12px 10px; text-align:right;">${i.price}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    // 5️⃣ Setup transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
      },
    });

    // 6️⃣ Send email safely with logo and contact details
    if (order.email) {
      try {
        const info = await transporter.sendMail({
          from: '"HanaMori" <no-reply@Hanamori.com>',
          to: order.email,
          subject: 'Order Confirmation',
          html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: 32px auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; background: #fff; box-shadow: 0 2px 8px #0001;">
              <div style="padding: 32px 32px 0 32px;">
                <h2 style="color: #b48a78; margin-bottom: 8px;">Thank you for your order!</h2>
                <p style="font-size: 17px; margin: 0 0 8px 0;">Dear Customer,</p>
                <p style="font-size: 15px; margin: 0 0 18px 0;">We have received your order. Here are the details:</p>
                <div style="background: #f8f6f4; border-radius: 8px; padding: 16px 20px; margin-bottom: 18px;">
                  <p style="margin: 0 0 6px 0;"><strong>Order ID:</strong> <span style="color:#b48a78;">${order._id}</span></p>
                  <p style="margin: 0 0 6px 0;"><strong>Total:</strong> <span style="color:#b48a78;">${order.total} DNT</span></p>
                </div>
                <div style="margin-bottom: 18px;">
                  <strong style="font-size: 16px;">Items:</strong>
                  ${itemsHtml}
                </div>
                <hr style="margin: 28px 0 18px 0; border: none; border-top: 1px solid #eee;" />
                <div style="font-size: 15px; color: #555; margin-bottom: 8px;">
                  <strong>Contact us (Aldi):</strong><br />
                  Email: <a href="mailto:aldi@hanamori.com" style="color:#b48a78;">aldi@hanamori.com</a><br />
                  Phone: +123-456-7890<br />
                  Address: 123 HanaMori St, City, Country
                </div>
              </div>
              <div style="background: #f9f9f9; text-align: center; padding: 28px 0 16px 0; margin-top: 24px; border-top: 1px solid #eee;">
                <img src="cid:hanamori-logo" alt="HanaMori Logo" style="height: 60px; margin-bottom: 10px;" /><br />
                <span style="color: #b48a78; font-weight: bold; font-size: 20px; letter-spacing: 1px;">HanaMori</span>
                <div style="font-size: 13px; color: #888; margin-top: 6px;">&copy; ${new Date().getFullYear()} HanaMori. All rights reserved.</div>
              </div>
            </div>
          `,
          attachments: [
            {
              filename: 'hanaMori.png',
              path: __dirname + '/../../assets/hanaModeLogoWhite.png',
              cid: 'hanamori-logo', // same as in the img src above
            },
          ],
        });
        console.log('Order confirmation email sent:', info.response);
      } catch (mailErr) {
        console.error('Error sending order confirmation email, but order was saved:', mailErr);
        console.log('EMAIL_USER:', process.env.EMAIL_USER);
        console.log('Recipient email:', order.email);
      }
    } else {
      console.log('EMAIL_USER:', process.env.EMAIL_USER);
      console.log('Recipient email:', order.email);
      console.warn('No email provided, skipping email sending.');
    }

    // 7️⃣ Respond with the order
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }
    res.status(500).json({ message: 'Error creating order', error });
  }
};