import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

export function validateObjectId(param = 'id') {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!mongoose.isValidObjectId(req.params[param])) return res.status(400).json({ message: 'Invalid ID' });
    next();
  };
}