"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContactMessage = exports.listContactMessages = exports.createContactMessage = void 0;
const ContactMessage_1 = require("../models/ContactMessage");
const createContactMessage = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        if (!name || !message) {
            return res.status(400).json({ message: 'Name and message are required' });
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
const deleteContactMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await ContactMessage_1.ContactMessage.findByPk(id);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        await message.destroy();
        res.json({ message: 'Message deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete message', error });
    }
};
exports.deleteContactMessage = deleteContactMessage;
//# sourceMappingURL=contactController.js.map