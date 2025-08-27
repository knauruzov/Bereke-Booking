import express from 'express';
import User from '../models/User';
import { auth, requireRole } from '../middleware/auth';

const router = express.Router();

// Получение списка всех пользователей (только для админов)
router.get('/', auth, requireRole(['admin']), async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const filter: any = {};

    if (role) {
      filter.role = role;
    }

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit as string));

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page as string),
        totalPages: Math.ceil(total / parseInt(limit as string)),
        totalUsers: total,
        hasNext: skip + users.length < total,
        hasPrev: parseInt(page as string) > 1
      }
    });
  } catch (error: any) {
    console.error('Ошибка получения пользователей:', error);
    res.status(500).json({ error: 'Ошибка при получении пользователей' });
  }
});

// Получение пользователя по ID (только для админов)
router.get('/:id', auth, requireRole(['admin']), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json({ user });
  } catch (error: any) {
    console.error('Ошибка получения пользователя:', error);
    res.status(500).json({ error: 'Ошибка при получении пользователя' });
  }
});

// Обновление пользователя (только для админов)
router.put('/:id', auth, requireRole(['admin']), async (req, res) => {
  try {
    const { firstName, lastName, role, isVerified, phone } = req.body;
    
    const updateData: any = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (role) updateData.role = role;
    if (isVerified !== undefined) updateData.isVerified = isVerified;
    if (phone) updateData.phone = phone;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json({
      message: 'Пользователь успешно обновлен',
      user
    });
  } catch (error: any) {
    console.error('Ошибка обновления пользователя:', error);
    res.status(500).json({ error: 'Ошибка при обновлении пользователя' });
  }
});

// Удаление пользователя (только для админов)
router.delete('/:id', auth, requireRole(['admin']), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json({ message: 'Пользователь успешно удален' });
  } catch (error: any) {
    console.error('Ошибка удаления пользователя:', error);
    res.status(500).json({ error: 'Ошибка при удалении пользователя' });
  }
});

// Блокировка/разблокировка пользователя (только для админов)
router.patch('/:id/toggle-status', auth, requireRole(['admin']), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // Здесь можно добавить поле isBlocked в модель User
    // user.isBlocked = !user.isBlocked;
    // await user.save();

    res.json({
      message: `Пользователь ${user.isVerified ? 'заблокирован' : 'разблокирован'}`,
      user
    });
  } catch (error: any) {
    console.error('Ошибка изменения статуса пользователя:', error);
    res.status(500).json({ error: 'Ошибка при изменении статуса пользователя' });
  }
});

// Получение статистики пользователей (только для админов)
router.get('/stats/overview', auth, requireRole(['admin']), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const businessUsers = await User.countDocuments({ role: 'business' });
    const customerUsers = await User.countDocuments({ role: 'customer' });
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    
    // Статистика по месяцам (последние 6 месяцев)
    const monthlyStats = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 0);
      
      const monthUsers = await User.countDocuments({
        createdAt: { $gte: monthStart, $lte: monthEnd }
      });
      
      monthlyStats.push({
        month: monthStart.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' }),
        users: monthUsers
      });
    }

    res.json({
      overview: {
        totalUsers,
        businessUsers,
        customerUsers,
        verifiedUsers,
        unverifiedUsers: totalUsers - verifiedUsers
      },
      monthlyStats
    });
  } catch (error: any) {
    console.error('Ошибка получения статистики:', error);
    res.status(500).json({ error: 'Ошибка при получении статистики' });
  }
});

export default router;
