import { Request, Response, NextFunction } from 'express';

// Validate that the ID is a valid integer for MySQL
export function validateObjectId(param = 'id') {
  return (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params[param]);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: 'Invalid ID' });
    }
    next();
  };
}