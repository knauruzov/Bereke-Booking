import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Расширяем интерфейс Request для добавления user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Токен доступа не предоставлен' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ error: 'Пользователь не найден' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Неверный токен доступа' });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Требуется аутентификация' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Недостаточно прав для выполнения операции' });
    }

    next();
  };
};

export const requireBusinessOwner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Требуется аутентификация' });
    }

    if (req.user.role !== 'business') {
      return res.status(403).json({ error: 'Только владельцы бизнеса могут выполнять эту операцию' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Ошибка проверки прав доступа' });
  }
};

export const requireCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Требуется аутентификация' });
    }

    if (req.user.role !== 'customer') {
      return res.status(403).json({ error: 'Только клиенты могут выполнять эту операцию' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Ошибка проверки прав доступа' });
  }
};
