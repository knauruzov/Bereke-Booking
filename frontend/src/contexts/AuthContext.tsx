import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { authApi } from '../api/auth'
import { User } from '../types'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
}

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  role: 'business' | 'customer'
  phone?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const queryClient = useQueryClient()

  // Проверяем токен при загрузке
  const { data: userData, isLoading: isCheckingAuth } = useQuery(
    'user',
    authApi.getProfile,
    {
      retry: false,
      onError: () => {
        // Если токен недействителен, очищаем localStorage
        localStorage.removeItem('token')
        setUser(null)
      },
      onSuccess: (data) => {
        setUser(data.user)
      },
      onSettled: () => {
        setIsLoading(false)
      }
    }
  )

  useEffect(() => {
    // Проверяем токен в localStorage
    const token = localStorage.getItem('token')
    if (token) {
      // Токен есть, но пользователь еще не загружен
      setIsLoading(true)
    } else {
      // Токена нет, пользователь не авторизован
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password)
      const { token, user: userData } = response
      
      localStorage.setItem('token', token)
      setUser(userData)
      
      // Обновляем кеш
      queryClient.setQueryData('user', { user: userData })
      
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      const response = await authApi.register(userData)
      const { token, user: newUser } = response
      
      localStorage.setItem('token', token)
      setUser(newUser)
      
      // Обновляем кеш
      queryClient.setQueryData('user', { user: newUser })
      
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    
    // Очищаем кеш
    queryClient.clear()
  }

  const updateProfile = async (data: Partial<User>) => {
    try {
      const response = await authApi.updateProfile(data)
      const updatedUser = { ...user, ...response.user }
      
      setUser(updatedUser)
      
      // Обновляем кеш
      queryClient.setQueryData('user', { user: updatedUser })
      
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const value: AuthContextType = {
    user,
    isLoading: isLoading || isCheckingAuth,
    login,
    register,
    logout,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
