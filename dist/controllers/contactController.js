"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listContactMessages = exports.createContactMessage = void 0;
const ContactMessage_1 = require("../models/ContactMessage");
const createContactMessage = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Name, email and message are required' });
        }
        const contactMessage = await ContactMessage_1.ContactMessage.create({
            name,
            email,
            phone,
            message
        });
        res.status(201).json({ message: 'Message received', contactMessage });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to submit contact form', error });
    }
};
exports.createContactMessage = createContactMessage;
const listContactMessages = async (_req, res) => {
    try {
        const messages = await ContactMessage_1.ContactMessage.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(messages);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch contact messages', error });
    }
};
exports.listContactMessages = listContactMessages;
//# sourceMappingURL=contactController.js.map