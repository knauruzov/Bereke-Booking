import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
  business: mongoose.Types.ObjectId;
  name: string;
  description: string;
  duration: number; // в минутах
  price: number;
  currency: string;
  category: string;
  isActive: boolean;
  maxBookingsPerSlot: number;
  requiresConfirmation: boolean;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>({
  business: {
    type: Schema.Types.ObjectId,
    ref: 'Business',
    required: [true, 'Бизнес обязателен']
  },
  name: {
    type: String,
    required: [true, 'Название услуги обязательно'],
    trim: true,
    maxlength: [100, 'Название не может быть длиннее 100 символов']
  },
  description: {
    type: String,
    required: [true, 'Описание услуги обязательно'],
    maxlength: [500, 'Описание не может быть длиннее 500 символов']
  },
  duration: {
    type: Number,
    required: [true, 'Длительность услуги обязательна'],
    min: [15, 'Длительность должна быть минимум 15 минут'],
    max: [480, 'Длительность не может быть больше 8 часов']
  },
  price: {
    type: Number,
    required: [true, 'Цена услуги обязательна'],
    min: [0, 'Цена не может быть отрицательной']
  },
  currency: {
    type: String,
    default: 'KZT',
    enum: ['KZT', 'USD', 'EUR', 'RUB']
  },
  category: {
    type: String,
    required: [true, 'Категория услуги обязательна'],
    enum: [
      'consultation', 'treatment', 'procedure', 'session',
      'lesson', 'maintenance', 'repair', 'cleaning',
      'delivery', 'other'
    ]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  maxBookingsPerSlot: {
    type: Number,
    default: 1,
    min: [1, 'Минимум 1 бронирование на слот']
  },
  requiresConfirmation: {
    type: Boolean,
    default: false
  },
  images: [{
    type: String
  }]
}, {
  timestamps: true
});

// Индексы для поиска
serviceSchema.index({ business: 1, isActive: 1 });
serviceSchema.index({ category: 1 });
serviceSchema.index({ name: 'text', description: 'text' });

export default mongoose.model<IService>('Service', serviceSchema);
