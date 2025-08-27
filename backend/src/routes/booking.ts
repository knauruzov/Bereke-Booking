import express from 'express';
import { body, validationResult } from 'express-validator';
import Booking from '../models/Booking';
import Service from '../models/Service';
import Business from '../models/Business';
import { auth, requireCustomer, requireBusinessOwner } from '../middleware/auth';
import moment from 'moment';

const router = express.Router();

// Создание нового бронирования
router.post('/', auth, requireCustomer, [
  body('serviceId').notEmpty().withMessage('ID услуги обязателен'),
  body('date').isISO8601().withMessage('Неверный формат даты'),
  body('startTime').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Неверный формат времени начала'),
  body('notes').optional().isString().withMessage('Заметки должны быть строкой')
], async (req, res) => {
  try {
    // Проверка валидации
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { serviceId, date, startTime, notes } = req.body;

    // Проверка существования услуги
    const service = await Service.findById(serviceId).populate('business');
    if (!service) {
      return res.status(404).json({ error: 'Услуга не найдена' });
    }

    if (!service.isActive) {
      return res.status(400).json({ error: 'Услуга неактивна' });
    }

    // Проверка даты (не в прошлом)
    const bookingDate = moment(date);
    if (bookingDate.isBefore(moment(), 'day')) {
      return res.status(400).json({ error: 'Нельзя бронировать на прошедшую дату' });
    }

    // Расчет времени окончания
    const endTime = moment(startTime, 'HH:mm').add(service.duration, 'minutes').format('HH:mm');

    // Проверка рабочего времени бизнеса
    const dayOfWeek = bookingDate.format('dddd').toLowerCase();
    const business = service.business as any;
    const workingHours = business.workingHours[dayOfWeek];

    if (!workingHours.isOpen) {
      return res.status(400).json({ error: 'Бизнес не работает в этот день' });
    }

    const startMoment = moment(startTime, 'HH:mm');
    const openMoment = moment(workingHours.open, 'HH:mm');
    const closeMoment = moment(workingHours.close, 'HH:mm');

    if (startMoment.isBefore(openMoment) || startMoment.isAfter(closeMoment)) {
      return res.status(400).json({ error: 'Время бронирования вне рабочего времени' });
    }

    // Проверка доступности времени
    const existingBookings = await Booking.find({
      service: serviceId,
      date: bookingDate.toDate(),
      status: { $in: ['pending', 'confirmed'] }
    });

    const conflictingBookings = existingBookings.filter(booking => {
      const bookingStart = moment(booking.startTime, 'HH:mm');
      const bookingEnd = moment(booking.endTime, 'HH:mm');
      const newStart = moment(startTime, 'HH:mm');
      const newEnd = moment(endTime, 'HH:mm');

      return (newStart.isBefore(bookingEnd) && newEnd.isAfter(bookingStart));
    });

    if (conflictingBookings.length >= service.maxBookingsPerSlot) {
      return res.status(400).json({ error: 'Выбранное время недоступно' });
    }

    // Создание бронирования
    const booking = new Booking({
      customer: req.user._id,
      business: business._id,
      service: serviceId,
      date: bookingDate.toDate(),
      startTime,
      endTime,
      totalPrice: service.price,
      currency: service.currency,
      notes,
      status: service.requiresConfirmation ? 'pending' : 'confirmed'
    });

    await booking.save();

    res.status(201).json({
      message: 'Бронирование успешно создано',
      booking
    });
  } catch (error: any) {
    console.error('Ошибка создания бронирования:', error);
    res.status(500).json({ error: 'Ошибка при создании бронирования' });
  }
});

// Получение бронирований клиента
router.get('/my-bookings', auth, requireCustomer, async (req, res) => {
  try {
    const { status, upcoming } = req.query;
    const filter: any = { customer: req.user._id };

    if (status) {
      filter.status = status;
    }

    if (upcoming === 'true') {
      filter.date = { $gte: new Date() };
    }

    const bookings = await Booking.find(filter)
      .populate('business', 'name category address')
      .populate('service', 'name duration price')
      .sort({ date: -1, startTime: -1 });

    res.json({ bookings });
  } catch (error: any) {
    console.error('Ошибка получения бронирований:', error);
    res.status(500).json({ error: 'Ошибка при получении бронирований' });
  }
});

// Получение бронирований бизнеса
router.get('/business', auth, requireBusinessOwner, async (req, res) => {
  try {
    const { status, date, serviceId } = req.query;
    const filter: any = {};

    // Получаем бизнес пользователя
    const business = await Business.findOne({ owner: req.user._id });
    if (!business) {
      return res.status(400).json({ error: 'Бизнес не найден' });
    }

    filter.business = business._id;

    if (status) {
      filter.status = status;
    }

    if (date) {
      const filterDate = moment(date).startOf('day');
      filter.date = {
        $gte: filterDate.toDate(),
        $lt: filterDate.add(1, 'day').toDate()
      };
    }

    if (serviceId) {
      filter.service = serviceId;
    }

    const bookings = await Booking.find(filter)
      .populate('customer', 'firstName lastName email phone')
      .populate('service', 'name duration price')
      .sort({ date: 1, startTime: 1 });

    res.json({ bookings });
  } catch (error: any) {
    console.error('Ошибка получения бронирований бизнеса:', error);
    res.status(500).json({ error: 'Ошибка при получении бронирований' });
  }
});

// Получение конкретного бронирования
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customer', 'firstName lastName email phone')
      .populate('business', 'name category address contact')
      .populate('service', 'name duration price');

    if (!booking) {
      return res.status(404).json({ error: 'Бронирование не найдено' });
    }

    // Проверка прав доступа
    if (req.user.role === 'customer' && booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Нет прав для просмотра этого бронирования' });
    }

    if (req.user.role === 'business') {
      const business = await Business.findOne({ owner: req.user._id });
      if (!business || booking.business.toString() !== business._id.toString()) {
        return res.status(403).json({ error: 'Нет прав для просмотра этого бронирования' });
      }
    }

    res.json({ booking });
  } catch (error: any) {
    console.error('Ошибка получения бронирования:', error);
    res.status(500).json({ error: 'Ошибка при получении бронирования' });
  }
});

// Обновление статуса бронирования (для бизнеса)
router.patch('/:id/status', auth, requireBusinessOwner, [
  body('status').isIn(['confirmed', 'cancelled', 'completed', 'no-show']).withMessage('Неверный статус'),
  body('businessNotes').optional().isString().withMessage('Заметки должны быть строкой'),
  body('cancellationReason').optional().isString().withMessage('Причина отмены должна быть строкой')
], async (req, res) => {
  try {
    // Проверка валидации
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, businessNotes, cancellationReason } = req.body;

    // Проверка владения бизнесом
    const business = await Business.findOne({ owner: req.user._id });
    if (!business) {
      return res.status(400).json({ error: 'Бизнес не найден' });
    }

    const updateData: any = { status };
    if (businessNotes) updateData.businessNotes = businessNotes;
    if (cancellationReason) updateData.cancellationReason = cancellationReason;

    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, business: business._id },
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('customer', 'firstName lastName email phone')
     .populate('service', 'name duration price');

    if (!booking) {
      return res.status(404).json({ error: 'Бронирование не найдено или у вас нет прав на его редактирование' });
    }

    res.json({
      message: 'Статус бронирования обновлен',
      booking
    });
  } catch (error: any) {
    console.error('Ошибка обновления статуса:', error);
    res.status(500).json({ error: 'Ошибка при обновлении статуса' });
  }
});

// Отмена бронирования клиентом
router.patch('/:id/cancel', auth, requireCustomer, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      customer: req.user._id
    });

    if (!booking) {
      return res.status(404).json({ error: 'Бронирование не найдено' });
    }

    if (booking.status !== 'pending' && booking.status !== 'confirmed') {
      return res.status(400).json({ error: 'Нельзя отменить это бронирование' });
    }

    // Проверка времени (нельзя отменить менее чем за 2 часа)
    const bookingDateTime = moment(booking.date).set({
      hour: parseInt(booking.startTime.split(':')[0]),
      minute: parseInt(booking.startTime.split(':')[1])
    });

    if (moment().add(2, 'hours').isAfter(bookingDateTime)) {
      return res.status(400).json({ error: 'Нельзя отменить бронирование менее чем за 2 часа' });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = 'Отменено клиентом';
    await booking.save();

    res.json({
      message: 'Бронирование отменено',
      booking
    });
  } catch (error: any) {
    console.error('Ошибка отмены бронирования:', error);
    res.status(500).json({ error: 'Ошибка при отмене бронирования' });
  }
});

// Получение доступного времени для услуги
router.get('/available-times/:serviceId', async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Дата обязательна' });
    }

    const service = await Service.findById(serviceId).populate('business');
    if (!service || !service.isActive) {
      return res.status(404).json({ error: 'Услуга не найдена или неактивна' });
    }

    const business = service.business as any;
    const bookingDate = moment(date);
    const dayOfWeek = bookingDate.format('dddd').toLowerCase();
    const workingHours = business.workingHours[dayOfWeek];

    if (!workingHours.isOpen) {
      return res.json({ availableTimes: [] });
    }

    // Получаем существующие бронирования на эту дату
    const existingBookings = await Booking.find({
      service: serviceId,
      date: bookingDate.toDate(),
      status: { $in: ['pending', 'confirmed'] }
    });

    // Генерируем доступное время
    const availableTimes = [];
    const startTime = moment(workingHours.open, 'HH:mm');
    const endTime = moment(workingHours.close, 'HH:mm');
    const slotDuration = 30; // 30-минутные слоты

    while (startTime.isBefore(endTime)) {
      const slotStart = startTime.format('HH:mm');
      const slotEnd = startTime.add(service.duration, 'minutes').format('HH:mm');

      if (startTime.isAfter(endTime)) break;

      // Проверяем доступность слота
      const conflictingBookings = existingBookings.filter(booking => {
        const bookingStart = moment(booking.startTime, 'HH:mm');
        const bookingEnd = moment(booking.endTime, 'HH:mm');
        const slotStartMoment = moment(slotStart, 'HH:mm');
        const slotEndMoment = moment(slotEnd, 'HH:mm');

        return (slotStartMoment.isBefore(bookingEnd) && slotEndMoment.isAfter(bookingStart));
      });

      if (conflictingBookings.length < service.maxBookingsPerSlot) {
        availableTimes.push({
          startTime: slotStart,
          endTime: slotEnd
        });
      }

      startTime.add(slotDuration, 'minutes');
    }

    res.json({ availableTimes });
  } catch (error: any) {
    console.error('Ошибка получения доступного времени:', error);
    res.status(500).json({ error: 'Ошибка при получении доступного времени' });
  }
});

export default router;
