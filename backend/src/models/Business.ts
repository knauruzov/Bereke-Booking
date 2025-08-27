import mongoose, { Document, Schema } from 'mongoose';

export interface IBusiness extends Document {
  owner: mongoose.Types.ObjectId;
  name: string;
  description: string;
  category: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  workingHours: {
    monday: { open: string; close: string; isOpen: boolean };
    tuesday: { open: string; close: string; isOpen: boolean };
    wednesday: { open: string; close: string; isOpen: boolean };
    thursday: { open: string; close: string; isOpen: boolean };
    friday: { open: string; close: string; isOpen: boolean };
    saturday: { open: string; close: string; isOpen: boolean };
    sunday: { open: string; close: string; isOpen: boolean };
  };
  images: string[];
  logo?: string;
  isActive: boolean;
  rating: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

const businessSchema = new Schema<IBusiness>({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Владелец бизнеса обязателен']
  },
  name: {
    type: String,
    required: [true, 'Название бизнеса обязательно'],
    trim: true,
    maxlength: [100, 'Название не может быть длиннее 100 символов']
  },
  description: {
    type: String,
    required: [true, 'Описание бизнеса обязательно'],
    maxlength: [1000, 'Описание не может быть длиннее 1000 символов']
  },
  category: {
    type: String,
    required: [true, 'Категория бизнеса обязательна'],
    enum: [
      'beauty', 'health', 'fitness', 'education', 'automotive',
      'home', 'professional', 'entertainment', 'food', 'other'
    ]
  },
  address: {
    street: {
      type: String,
      required: [true, 'Улица обязательна']
    },
    city: {
      type: String,
      required: [true, 'Город обязателен']
    },
    state: {
      type: String,
      required: [true, 'Область/Регион обязательна']
    },
    zipCode: {
      type: String,
      required: [true, 'Почтовый индекс обязателен']
    },
    country: {
      type: String,
      required: [true, 'Страна обязательна']
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  contact: {
    phone: {
      type: String,
      required: [true, 'Телефон обязателен']
    },
    email: {
      type: String,
      required: [true, 'Email обязателен']
    },
    website: String
  },
  workingHours: {
    monday: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '18:00' },
      isOpen: { type: Boolean, default: true }
    },
    tuesday: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '18:00' },
      isOpen: { type: Boolean, default: true }
    },
    wednesday: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '18:00' },
      isOpen: { type: Boolean, default: true }
    },
    thursday: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '18:00' },
      isOpen: { type: Boolean, default: true }
    },
    friday: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '18:00' },
      isOpen: { type: Boolean, default: true }
    },
    saturday: {
      open: { type: String, default: '10:00' },
      close: { type: String, default: '16:00' },
      isOpen: { type: Boolean, default: false }
    },
    sunday: {
      open: { type: String, default: '10:00' },
      close: { type: String, default: '16:00' },
      isOpen: { type: Boolean, default: false }
    }
  },
  images: [{
    type: String
  }],
  logo: String,
  isActive: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Индексы для поиска
businessSchema.index({ name: 'text', description: 'text' });
businessSchema.index({ 'address.city': 1 });
businessSchema.index({ category: 1 });
businessSchema.index({ isActive: 1 });

export default mongoose.model<IBusiness>('Business', businessSchema);
