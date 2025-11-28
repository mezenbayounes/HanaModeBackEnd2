"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.createOrder = exports.getUserOrders = exports.getOrder = exports.listOrders = void 0;
const Order_1 = require("../models/Order");
const Product_1 = require("../models/Product");
const User_1 = __importDefault(require("../models/User"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const listOrders = async (req, res) => {
    try {
        const orders = await Order_1.Order.findAll({
            order: [['createdAt', 'DESC']]
        });
        // Manually populate product data for each order
        const populatedOrders = await Promise.all(orders.map(async (order) => {
            const orderData = order.toJSON();
            // Parse items and customerDetails if they're strings
            const items = typeof orderData.items === 'string' ? JSON.parse(orderData.items) : orderData.items;
            const customerDetails = typeof orderData.customerDetails === 'string' ? JSON.parse(orderData.customerDetails) : orderData.customerDetails;
            const populatedItems = await Promise.all(items.map(async (item) => {
                const product = await Product_1.Product.findByPk(item.product);
                if (product) {
                    const productData = product.toJSON();
                    // Parse product JSON fields
                    return {
                        ...item,
                        product: {
                            ...productData,
                            price: typeof productData.price === 'string' ? parseFloat(productData.price) : productData.price,
                            discountPrice: productData.discountPrice ? (typeof productData.discountPrice === 'string' ? parseFloat(productData.discountPrice) : productData.discountPrice) : undefined,
                            images: typeof productData.images === 'string' ? JSON.parse(productData.images) : productData.images,
                            sizes: typeof productData.sizes === 'string' ? JSON.parse(productData.sizes) : productData.sizes,
                            color: typeof productData.color === 'string' ? JSON.parse(productData.color) : productData.color,
                        }
                    };
                }
                return {
                    ...item,
                    product: null
                };
            }));
            return {
                ...orderData,
                total: typeof orderData.total === 'string' ? parseFloat(orderData.total) : orderData.total,
                items: populatedItems,
                customerDetails
            };
        }));
        res.json(populatedOrders);
    }
    catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders', error });
    }
};
exports.listOrders = listOrders;
const getOrder = async (req, res) => {
    try {
        const order = await Order_1.Order.findByPk(req.params.id);
        if (!order)
            return res.status(404).json({ message: 'Not found' });
        // Manually populate product data
        const orderData = order.toJSON();
        const populatedItems = await Promise.all(orderData.items.map(async (item) => {
            const product = await Product_1.Product.findByPk(item.product);
            return {
                ...item,
                product: product ? product.toJSON() : null
            };
        }));
        res.json({
            ...orderData,
            items: populatedItems
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching order', error });
    }
};
exports.getOrder = getOrder;
// Get orders for a specific user
const getUserOrders = async (req, res) => {
    try {
        const userId = req.user?.userId; // from auth middleware
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const orders = await Order_1.Order.findAll({
            where: { userId },
            order: [['orderDate', 'DESC']] // newest first
        });
        // Manually populate product data for each order
        const populatedOrders = await Promise.all(orders.map(async (order) => {
            const orderData = order.toJSON();
            // Parse items and customerDetails if they're strings
            const items = typeof orderData.items === 'string' ? JSON.parse(orderData.items) : orderData.items;
            const customerDetails = typeof orderData.customerDetails === 'string' ? JSON.parse(orderData.customerDetails) : orderData.customerDetails;
            const populatedItems = await Promise.all(items.map(async (item) => {
                const product = await Product_1.Product.findByPk(item.product);
                if (product) {
                    const productData = product.toJSON();
                    // Parse product JSON fields
                    return {
                        ...item,
                        product: {
                            ...productData,
                            price: typeof productData.price === 'string' ? parseFloat(productData.price) : productData.price,
                            discountPrice: productData.discountPrice ? (typeof productData.discountPrice === 'string' ? parseFloat(productData.discountPrice) : productData.discountPrice) : undefined,
                            images: typeof productData.images === 'string' ? JSON.parse(productData.images) : productData.images,
                            sizes: typeof productData.sizes === 'string' ? JSON.parse(productData.sizes) : productData.sizes,
                            color: typeof productData.color === 'string' ? JSON.parse(productData.color) : productData.color,
                        }
                    };
                }
                return {
                    ...item,
                    product: null
                };
            }));
            return {
                ...orderData,
                items: populatedItems,
                customerDetails
            };
        }));
        res.json(populatedOrders);
    }
    catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ message: 'Failed to fetch orders', error });
    }
};
exports.getUserOrders = getUserOrders;
const createOrder = async (req, res) => {
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
        const itemsDetails = [];
        for (const item of req.body.items) {
            console.log('Processing item:', item);
            const prod = await Product_1.Product.findByPk(item.product);
            if (!prod) {
                console.error('Product not found for item:', item);
            }
            if (prod) {
                // Use discount price only if it's valid (> 0 and less than regular price)
                let price = prod.price;
                if (prod.discountPrice && prod.discountPrice > 0 && prod.discountPrice < prod.price) {
                    price = prod.discountPrice;
                }
                total += Number(price) * item.quantity;
                // Use color name from item
                itemsDetails.push({
                    name: prod.name,
                    quantity: item.quantity,
                    size: item.size,
                    color: item.colorName || item.color || '-', // prefer colorName, fallback to color, then dash
                    price: Number(price),
                });
            }
        }
        // 3️⃣ Create and save order
        const rawUserId = req.user?.userId; // from auth middleware if logged in
        // Only use userId if it's a valid number AND exists in the users table
        let userId = null;
        if (rawUserId) {
            const parsedId = typeof rawUserId === 'string' ? parseInt(rawUserId, 10) : rawUserId;
            if (!isNaN(parsedId) && parsedId > 0) {
                // Verify user exists in database
                const userExists = await User_1.default.findByPk(parsedId);
                if (userExists) {
                    userId = parsedId;
                    console.log('Valid userId found:', userId);
                }
                else {
                    console.warn('User ID does not exist in database, treating as guest order. UserId:', parsedId);
                }
            }
            else {
                console.warn('Invalid userId format detected (likely MongoDB ObjectId), treating as guest order:', rawUserId);
            }
        }
        const order = await Order_1.Order.create({
            ...req.body,
            email, // always set email at top level for consistency
            userId, // save userId if valid user exists, otherwise null for guest orders
            total,
            status: req.body.status || 'pending', // default pending
        });
        console.log('Order saved:', order.toJSON());
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
        const transporter = nodemailer_1.default.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '465'),
            secure: process.env.SMTP_SECURE === 'true' || true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        // 6️⃣ Send email safely with logo and contact details
        if (order.email) {
            try {
                const info = await transporter.sendMail({
                    from: 'HanaMode <contact@hanamode.tn>',
                    to: order.email,
                    subject: 'Order Confirmation',
                    html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: 32px auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; background: #fff; box-shadow: 0 2px 8px #0001;">
              <div style="padding: 32px 32px 0 32px;">
                <h2 style="color: #b48a78; margin-bottom: 8px;">Thank you for your order!</h2>
                <p style="font-size: 17px; margin: 0 0 8px 0;">Dear Customer,</p>
                <p style="font-size: 15px; margin: 0 0 18px 0;">We have received your order. Here are the details:</p>
                <div style="background: #f8f6f4; border-radius: 8px; padding: 16px 20px; margin-bottom: 18px;">
                  <p style="margin: 0 0 6px 0;"><strong>Total:</strong> <span style="color:#b48a78;">${order.total} DNT</span></p>
                </div>
                <div style="margin-bottom: 18px;">
                  <strong style="font-size: 16px;">Items:</strong>
                  ${itemsHtml}
                </div>
                <hr style="margin: 28px 0 18px 0; border: none; border-top: 1px solid #eee;" />
                <div style="font-size: 15px; color: #555; margin-bottom: 8px;">
                  <strong>Contact us (Aldi):</strong><br />
                  Email: <a href="mailto:aldi@hanamori.com" style="color:#b48a78;">contact@hanamode.tn</a><br />
                  Phone: +216 25 524 828<br />
                  Address: 13 Rue de la Kasabah, Bab Bhar, Tunis
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
            }
            catch (mailErr) {
                console.error('Error sending order confirmation email, but order was saved:', mailErr);
                console.log('EMAIL_USER:', process.env.EMAIL_USER);
                console.log('Recipient email:', order.email);
            }
        }
        else {
            console.log('EMAIL_USER:', process.env.EMAIL_USER);
            console.log('Recipient email:', order.email);
            console.warn('No email provided, skipping email sending.');
        }
        // 7️⃣ Respond with the order
        res.status(201).json(order);
    }
    catch (error) {
        console.error('Error creating order:', error);
        if (error instanceof Error) {
            console.error('Error stack:', error.stack);
        }
        res.status(500).json({ message: 'Error creating order', error });
    }
};
exports.createOrder = createOrder;
// Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order_1.Order.findByPk(req.params.id);
        if (!order)
            return res.status(404).json({ message: 'Order not found' });
        order.status = status;
        await order.save();
        res.json({ message: 'Order status updated', order });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update order status', error });
    }
};
exports.updateOrderStatus = updateOrderStatus;
//# sourceMappingURL=orderController.js.map