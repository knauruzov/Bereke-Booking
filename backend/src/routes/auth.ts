import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { auth } from '../middleware/auth';

const router = express.Router();

// Генерация JWT токена
const generateToken = (userId: string) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};

// Регистрация пользователя
router.post('/register', [
  body('email').isEmail().withMessage('Неверный формат email'),
  body('password').isLength({ min: 6 }).withMessage('Пароль должен содержать минимум 6 символов'),
  body('firstName').notEmpty().withMessage('Имя обязательно'),
  body('lastName').notEmpty().withMessage('Фамилия обязательна'),
  body('role').isIn(['business', 'customer']).withMessage('Неверная роль')
], async (req, res) => {
  try {
    // Проверка валидации
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, firstName, lastName, role, phone } = req.body;

    // Проверка существования пользователя
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
    }

    // Создание нового пользователя
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      role,
      phone
    });

    await user.save();

    // Генерация токена
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Пользователь успешно зарегистрирован',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error: any) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({ error: 'Ошибка при регистрации пользователя' });
  }
});

// Вход пользователя
router.post('/login', [
  body('email').isEmail().withMessage('Неверный формат email'),
  body('password').notEmpty().withMessage('Пароль обязателен')
], async (req, res) => {
  try {
    // Проверка валидации
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Поиск пользователя
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Неверный email или пароль' });
    }

    // Проверка пароля
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Неверный email или пароль' });
    }

    // Генерация токена
    const token = generateToken(user._id);

    res.json({
      message: 'Вход выполнен успешно',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phone: user.phone,
        isVerified: user.isVerified
      }
    });
  } catch (error: any) {
    console.error('Ошибка входа:', error);
    res.status(500).json({ error: 'Ошибка при входе пользователя' });
  }
});

// Получение профиля текущего пользователя
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ user });
  } catch (error: any) {
    console.error('Ошибка получения профиля:', error);
    res.status(500).json({ error: 'Ошибка при получении профиля' });
  }
});

// Обновление профиля пользователя
router.put('/profile', auth, [
  body('firstName').optional().notEmpty().withMessage('Имя не может быть пустым'),
  body('lastName').optional().notEmpty().withMessage('Фамилия не может быть пустой'),
  body('phone').optional().matches(/^\+?[\d\s\-\(\)]+$/).withMessage('Неверный формат телефона')
], async (req, res) => {
  try {
    // Проверка валидации
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updates = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json({
      message: 'Профиль обновлен успешно',
      user
    });
  } catch (error: any) {
    console.error('Ошибка обновления профиля:', error);
    res.status(500).json({ error: 'Ошибка при обновлении профиля' });
  }
});

// Изменение пароля
router.put('/change-password', auth, [
  body('currentPassword').notEmpty().withMessage('Текущий пароль обязателен'),
  body('newPassword').isLength({ min: 6 }).withMessage('Новый пароль должен содержать минимум 6 символов')
], async (req, res) => {
  try {
    // Проверка валидации
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // Проверка текущего пароля
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: 'Неверный текущий пароль' });
    }

    // Обновление пароля
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Пароль успешно изменен' });
  } catch (error: any) {
    console.error('Ошибка изменения пароля:', error);
    res.status(500).json({ error: 'Ошибка при изменении пароля' });
  }
});

export default router;
