import { Request, Response } from 'express';
import { ContactMessage } from '../models/ContactMessage';

export const createContactMessage = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required' });
    }

    const contactMessage = await ContactMessage.create({
      name,
      email,
      phone,
      message
    });

    res.status(201).json({ message: 'Message received', contactMessage });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit contact form', error });
  }
};

export const listContactMessages = async (_req: Request, res: Response) => {
  try {
    const messages = await ContactMessage.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch contact messages', error });
  }
};
