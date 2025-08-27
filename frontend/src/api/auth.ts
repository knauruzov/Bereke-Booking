import apiClient from './client'
import { LoginCredentials, RegisterData, User, ApiResponse } from '../types'

export const authApi = {
  // Регистрация пользователя
  register: async (userData: RegisterData): Promise<{ token: string; user: User }> => {
    const response = await apiClient.post('/auth/register', userData)
    return response.data
  },

  // Вход пользователя
  login: async (credentials: LoginCredentials): Promise<{ token: string; user: User }> => {
    const response = await apiClient.post('/auth/login', credentials)
    return response.data
  },

  // Получение профиля текущего пользователя
  getProfile: async (): Promise<{ user: User }> => {
    const response = await apiClient.get('/auth/me')
    return response.data
  },

  // Обновление профиля пользователя
  updateProfile: async (data: Partial<User>): Promise<{ user: User }> => {
    const response = await apiClient.put('/auth/profile', data)
    return response.data
  },

  // Изменение пароля
  changePassword: async (currentPassword: string, newPassword: string): Promise<{ message: string }> => {
    const response = await apiClient.put('/auth/change-password', {
      currentPassword,
      newPassword
    })
    return response.data
  }
}
