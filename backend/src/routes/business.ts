import express from 'express';
import { body, validationResult } from 'express-validator';
import Business from '../models/Business';
import { auth, requireBusinessOwner } from '../middleware/auth';

const router = express.Router();

// Создание нового бизнеса
router.post('/', auth, requireBusinessOwner, [
  body('name').notEmpty().withMessage('Название бизнеса обязательно'),
  body('description').notEmpty().withMessage('Описание бизнеса обязательно'),
  body('category').isIn([
    'beauty', 'health', 'fitness', 'education', 'automotive',
    'home', 'professional', 'entertainment', 'food', 'other'
  ]).withMessage('Неверная категория'),
  body('address.street').notEmpty().withMessage('Улица обязательна'),
  body('address.city').notEmpty().withMessage('Город обязателен'),
  body('address.state').notEmpty().withMessage('Область/Регион обязательна'),
  body('address.zipCode').notEmpty().withMessage('Почтовый индекс обязателен'),
  body('address.country').notEmpty().withMessage('Страна обязательна'),
  body('contact.phone').notEmpty().withMessage('Телефон обязателен'),
  body('contact.email').isEmail().withMessage('Неверный формат email')
], async (req, res) => {
  try {
    // Проверка валидации
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Проверка существования бизнеса у пользователя
    const existingBusiness = await Business.findOne({ owner: req.user._id });
    if (existingBusiness) {
      return res.status(400).json({ error: 'У вас уже есть зарегистрированный бизнес' });
    }

    const businessData = {
      ...req.body,
      owner: req.user._id,
      contact: {
        ...req.body.contact,
        email: req.user.email // Используем email из профиля пользователя
      }
    };

    const business = new Business(businessData);
    await business.save();

    res.status(201).json({
      message: 'Бизнес успешно создан',
      business
    });
  } catch (error: any) {
    console.error('Ошибка создания бизнеса:', error);
    res.status(500).json({ error: 'Ошибка при создании бизнеса' });
  }
});

// Получение бизнеса текущего пользователя
router.get('/my-business', auth, requireBusinessOwner, async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.user._id })
      .populate('owner', 'firstName lastName email phone');

    if (!business) {
      return res.status(404).json({ error: 'Бизнес не найден' });
    }

    res.json({ business });
  } catch (error: any) {
    console.error('Ошибка получения бизнеса:', error);
    res.status(500).json({ error: 'Ошибка при получении бизнеса' });
  }
});

// Обновление бизнеса
router.put('/my-business', auth, requireBusinessOwner, [
  body('name').optional().notEmpty().withMessage('Название не может быть пустым'),
  body('description').optional().notEmpty().withMessage('Описание не может быть пустым'),
  body('category').optional().isIn([
    'beauty', 'health', 'fitness', 'education', 'automotive',
    'home', 'professional', 'entertainment', 'food', 'other'
  ]).withMessage('Неверная категория')
], async (req, res) => {
  try {
    // Проверка валидации
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const business = await Business.findOneAndUpdate(
      { owner: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('owner', 'firstName lastName email phone');

    if (!business) {
      return res.status(404).json({ error: 'Бизнес не найден' });
    }

    res.json({
      message: 'Бизнес успешно обновлен',
      business
    });
  } catch (error: any) {
    console.error('Ошибка обновления бизнеса:', error);
    res.status(500).json({ error: 'Ошибка при обновлении бизнеса' });
  }
});

// Получение списка всех активных бизнесов (для клиентов)
router.get('/', async (req, res) => {
  try {
    const { category, city, search } = req.query;
    const filter: any = { isActive: true };

    if (category) {
      filter.category = category;
    }

    if (city) {
      filter['address.city'] = { $regex: city, $options: 'i' };
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const businesses = await Business.find(filter)
      .populate('owner', 'firstName lastName')
      .select('-workingHours')
      .sort({ rating: -1, totalReviews: -1 });

    res.json({ businesses });
  } catch (error: any) {
    console.error('Ошибка получения списка бизнесов:', error);
    res.status(500).json({ error: 'Ошибка при получении списка бизнесов' });
  }
});

// Получение конкретного бизнеса по ID
router.get('/:id', async (req, res) => {
  try {
    const business = await Business.findById(req.params.id)
      .populate('owner', 'firstName lastName')
      .populate({
        path: 'services',
        match: { isActive: true }
      });

    if (!business) {
      return res.status(404).json({ error: 'Бизнес не найден' });
    }

    res.json({ business });
  } catch (error: any) {
    console.error('Ошибка получения бизнеса:', error);
    res.status(500).json({ error: 'Ошибка при получении бизнеса' });
  }
});

// Обновление рабочего времени
router.put('/my-business/working-hours', auth, requireBusinessOwner, async (req, res) => {
  try {
    const { workingHours } = req.body;

    if (!workingHours) {
      return res.status(400).json({ error: 'Рабочее время обязательно' });
    }

    const business = await Business.findOneAndUpdate(
      { owner: req.user._id },
      { $set: { workingHours } },
      { new: true, runValidators: true }
    );

    if (!business) {
      return res.status(404).json({ error: 'Бизнес не найден' });
    }

    res.json({
      message: 'Рабочее время успешно обновлено',
      workingHours: business.workingHours
    });
  } catch (error: any) {
    console.error('Ошибка обновления рабочего времени:', error);
    res.status(500).json({ error: 'Ошибка при обновлении рабочего времени' });
  }
});

// Загрузка изображений для бизнеса
router.put('/my-business/images', auth, requireBusinessOwner, async (req, res) => {
  try {
    const { images, logo } = req.body;
    const updateData: any = {};

    if (images) {
      updateData.images = images;
    }

    if (logo) {
      updateData.logo = logo;
    }

    const business = await Business.findOneAndUpdate(
      { owner: req.user._id },
      { $set: updateData },
      { new: true }
    );

    if (!business) {
      return res.status(404).json({ error: 'Бизнес не найден' });
    }

    res.json({
      message: 'Изображения успешно обновлены',
      images: business.images,
      logo: business.logo
    });
  } catch (error: any) {
    console.error('Ошибка обновления изображений:', error);
    res.status(500).json({ error: 'Ошибка при обновлении изображений' });
  }
});

export default router;
