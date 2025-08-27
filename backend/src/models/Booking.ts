import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  customer: mongoose.Types.ObjectId;
  business: mongoose.Types.ObjectId;
  service: mongoose.Types.ObjectId;
  date: Date;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';
  totalPrice: number;
  currency: string;
  notes?: string;
  customerNotes?: string;
  businessNotes?: string;
  isConfirmed: boolean;
  confirmationDate?: Date;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>({
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Клиент обязателен']
  },
  business: {
    type: Schema.Types.ObjectId,
    ref: 'Business',
    required: [true, 'Бизнес обязателен']
  },
  service: {
    type: Schema.Types.ObjectId,
    ref: 'Service',
    required: [true, 'Услуга обязательна']
  },
  date: {
    type: Date,
    required: [true, 'Дата бронирования обязательна'],
    validate: {
      validator: function(value: Date) {
        return value >= new Date();
      },
      message: 'Дата бронирования не может быть в прошлом'
    }
  },
  startTime: {
    type: String,
    required: [true, 'Время начала обязательно'],
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Неверный формат времени']
  },
  endTime: {
    type: String,
    required: [true, 'Время окончания обязательно'],
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Неверный формат времени']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'],
    default: 'pending'
  },
  totalPrice: {
    type: Number,
    required: [true, 'Общая цена обязательна'],
    min: [0, 'Цена не может быть отрицательной']
  },
  currency: {
    type: String,
    default: 'KZT',
    enum: ['KZT', 'USD', 'EUR', 'RUB']
  },
  notes: String,
  customerNotes: String,
  businessNotes: String,
  isConfirmed: {
    type: Boolean,
    default: false
  },
  confirmationDate: Date,
  cancellationReason: String
}, {
  timestamps: true
});

// Виртуальное поле для полной даты и времени
bookingSchema.virtual('fullDateTime').get(function() {
  const date = this.date.toISOString().split('T')[0];
  return `${date} ${this.startTime}`;
});

// Виртуальное поле для длительности
bookingSchema.virtual('duration').get(function() {
  const start = new Date(`2000-01-01T${this.startTime}`);
  const end = new Date(`2000-01-01T${this.endTime}`);
  const diffMs = end.getTime() - start.getTime();
  const diffMins = Math.round(diffMs / 60000);
  return diffMins;
});

// Индексы для поиска
bookingSchema.index({ customer: 1, date: -1 });
bookingSchema.index({ business: 1, date: -1 });
bookingSchema.index({ service: 1, date: -1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ date: 1, startTime: 1 });

// Middleware для автоматического обновления статуса
bookingSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'confirmed') {
    this.isConfirmed = true;
    this.confirmationDate = new Date();
  }
  next();
});

export default mongoose.model<IBooking>('Booking', bookingSchema);
