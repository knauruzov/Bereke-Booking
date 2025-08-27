import express from 'express';
import { body, validationResult } from 'express-validator';
import Service from '../models/Service';
import Business from '../models/Business';
import { auth, requireBusinessOwner } from '../middleware/auth';

const router = express.Router();

// Создание новой услуги
router.post('/', auth, requireBusinessOwner, [
  body('name').notEmpty().withMessage('Название услуги обязательно'),
  body('description').notEmpty().withMessage('Описание услуги обязательно'),
  body('duration').isInt({ min: 15, max: 480 }).withMessage('Длительность должна быть от 15 до 480 минут'),
  body('price').isFloat({ min: 0 }).withMessage('Цена должна быть положительной'),
  body('category').isIn([
    'consultation', 'treatment', 'procedure', 'session',
    'lesson', 'maintenance', 'repair', 'cleaning',
    'delivery', 'other'
  ]).withMessage('Неверная категория услуги')
], async (req, res) => {
  try {
    // Проверка валидации
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Проверка существования бизнеса у пользователя
    const business = await Business.findOne({ owner: req.user._id });
    if (!business) {
      return res.status(400).json({ error: 'Сначала создайте бизнес' });
    }

    const serviceData = {
      ...req.body,
      business: business._id
    };

    const service = new Service(serviceData);
    await service.save();

    res.status(201).json({
      message: 'Услуга успешно создана',
      service
    });
  } catch (error: any) {
    console.error('Ошибка создания услуги:', error);
    res.status(500).json({ error: 'Ошибка при создании услуги' });
  }
});

// Получение всех услуг бизнеса
router.get('/business/:businessId', async (req, res) => {
  try {
    const { businessId } = req.params;
    const { active } = req.query;

    const filter: any = { business: businessId };
    
    if (active !== undefined) {
      filter.isActive = active === 'true';
    }

    const services = await Service.find(filter)
      .populate('business', 'name category')
      .sort({ name: 1 });

    res.json({ services });
  } catch (error: any) {
    console.error('Ошибка получения услуг:', error);
    res.status(500).json({ error: 'Ошибка при получении услуг' });
  }
});

// Получение услуг текущего бизнеса
router.get('/my-business', auth, requireBusinessOwner, async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });
    if (!business) {
      return res.status(400).json({ error: 'Бизнес не найден' });
    }

    const services = await Service.find({ business: business._id })
      .sort({ name: 1 });

    res.json({ services });
  } catch (error: any) {
    console.error('Ошибка получения услуг:', error);
    res.status(500).json({ error: 'Ошибка при получении услуг' });
  }
});

// Получение конкретной услуги
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('business', 'name category address contact');

    if (!service) {
      return res.status(404).json({ error: 'Услуга не найдена' });
    }

    res.json({ service });
  } catch (error: any) {
    console.error('Ошибка получения услуги:', error);
    res.status(500).json({ error: 'Ошибка при получении услуги' });
  }
});

// Обновление услуги
router.put('/:id', auth, requireBusinessOwner, [
  body('name').optional().notEmpty().withMessage('Название не может быть пустым'),
  body('description').optional().notEmpty().withMessage('Описание не может быть пустым'),
  body('duration').optional().isInt({ min: 15, max: 480 }).withMessage('Длительность должна быть от 15 до 480 минут'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Цена должна быть положительной'),
  body('category').optional().isIn([
    'consultation', 'treatment', 'procedure', 'session',
    'lesson', 'maintenance', 'repair', 'cleaning',
    'delivery', 'other'
  ]).withMessage('Неверная категория услуги')
], async (req, res) => {
  try {
    // Проверка валидации
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Проверка владения услугой
    const business = await Business.findOne({ owner: req.user._id });
    if (!business) {
      return res.status(400).json({ error: 'Бизнес не найден' });
    }

    const service = await Service.findOneAndUpdate(
      { _id: req.params.id, business: business._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({ error: 'Услуга не найдена или у вас нет прав на её редактирование' });
    }

    res.json({
      message: 'Услуга успешно обновлена',
      service
    });
  } catch (error: any) {
    console.error('Ошибка обновления услуги:', error);
    res.status(500).json({ error: 'Ошибка при обновлении услуги' });
  }
});

// Удаление услуги
router.delete('/:id', auth, requireBusinessOwner, async (req, res) => {
  try {
    // Проверка владения услугой
    const business = await Business.findOne({ owner: req.user._id });
    if (!business) {
      return res.status(400).json({ error: 'Бизнес не найден' });
    }

    const service = await Service.findOneAndDelete({
      _id: req.params.id,
      business: business._id
    });

    if (!service) {
      return res.status(404).json({ error: 'Услуга не найдена или у вас нет прав на её удаление' });
    }

    res.json({ message: 'Услуга успешно удалена' });
  } catch (error: any) {
    console.error('Ошибка удаления услуги:', error);
    res.status(500).json({ error: 'Ошибка при удалении услуги' });
  }
});

// Активация/деактивация услуги
router.patch('/:id/toggle-status', auth, requireBusinessOwner, async (req, res) => {
  try {
    // Проверка владения услугой
    const business = await Business.findOne({ owner: req.user._id });
    if (!business) {
      return res.status(400).json({ error: 'Бизнес не найден' });
    }

    const service = await Service.findOne({
      _id: req.params.id,
      business: business._id
    });

    if (!service) {
      return res.status(404).json({ error: 'Услуга не найдена или у вас нет прав на её редактирование' });
    }

    service.isActive = !service.isActive;
    await service.save();

    res.json({
      message: `Услуга ${service.isActive ? 'активирована' : 'деактивирована'}`,
      service
    });
  } catch (error: any) {
    console.error('Ошибка изменения статуса услуги:', error);
    res.status(500).json({ error: 'Ошибка при изменении статуса услуги' });
  }
});

// Поиск услуг по категории и городу
router.get('/search', async (req, res) => {
  try {
    const { category, city, search } = req.query;
    const filter: any = { isActive: true };

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const services = await Service.find(filter)
      .populate({
        path: 'business',
        match: city ? { 'address.city': { $regex: city, $options: 'i' } } : {},
        select: 'name category address contact rating totalReviews'
      })
      .sort({ 'business.rating': -1, 'business.totalReviews': -1 });

    // Фильтруем услуги с существующими бизнесами
    const filteredServices = services.filter(service => service.business);

    res.json({ services: filteredServices });
  } catch (error: any) {
    console.error('Ошибка поиска услуг:', error);
    res.status(500).json({ error: 'Ошибка при поиске услуг' });
  }
});

export default router;
