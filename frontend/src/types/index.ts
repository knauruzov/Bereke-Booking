export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: 'business' | 'customer' | 'admin'
  isVerified: boolean
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface Business {
  id: string
  owner: string
  name: string
  description: string
  category: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  contact: {
    phone: string
    email: string
    website?: string
  }
  workingHours: {
    monday: { open: string; close: string; isOpen: boolean }
    tuesday: { open: string; close: string; isOpen: boolean }
    wednesday: { open: string; close: string; isOpen: boolean }
    thursday: { open: string; close: string; isOpen: boolean }
    friday: { open: string; close: string; isOpen: boolean }
    saturday: { open: string; close: string; isOpen: boolean }
    sunday: { open: string; close: string; isOpen: boolean }
  }
  images: string[]
  logo?: string
  isActive: boolean
  rating: number
  totalReviews: number
  createdAt: string
  updatedAt: string
}

export interface Service {
  id: string
  business: string
  name: string
  description: string
  duration: number
  price: number
  currency: string
  category: string
  isActive: boolean
  maxBookingsPerSlot: number
  requiresConfirmation: boolean
  images: string[]
  createdAt: string
  updatedAt: string
}

export interface Booking {
  id: string
  customer: string
  business: string
  service: string
  date: string
  startTime: string
  endTime: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show'
  totalPrice: number
  currency: string
  notes?: string
  customerNotes?: string
  businessNotes?: string
  isConfirmed: boolean
  confirmationDate?: string
  cancellationReason?: string
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T> {
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  role: 'business' | 'customer'
  phone?: string
}

export interface BusinessFormData {
  name: string
  description: string
  category: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  contact: {
    phone: string
    website?: string
  }
  workingHours: {
    monday: { open: string; close: string; isOpen: boolean }
    tuesday: { open: string; close: string; isOpen: boolean }
    wednesday: { open: string; close: string; isOpen: boolean }
    thursday: { open: string; close: string; isOpen: boolean }
    friday: { open: string; close: string; isOpen: boolean }
    saturday: { open: string; close: string; isOpen: boolean }
    sunday: { open: string; close: string; isOpen: boolean }
  }
}

export interface ServiceFormData {
  name: string
  description: string
  duration: number
  price: number
  category: string
  maxBookingsPerSlot: number
  requiresConfirmation: boolean
}

export interface BookingFormData {
  serviceId: string
  date: string
  startTime: string
  notes?: string
}

export interface AvailableTime {
  startTime: string
  endTime: string
}
