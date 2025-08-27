import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../contexts/AuthContext'
import { Eye, EyeOff, Mail, Lock, User, Phone, Building2, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import { RegisterData } from '../types'

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<RegisterData & { confirmPassword: string }>()

  const password = watch('password')

  const onSubmit = async (data: RegisterData & { confirmPassword: string }) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Пароли не совпадают')
      return
    }

    setIsLoading(true)
    try {
      const { confirmPassword, ...registerData } = data
      await registerUser(registerData)
      toast.success('Регистрация выполнена успешно!')
      navigate('/dashboard')
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Ошибка при регистрации'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Создать аккаунт
          </h1>
          <p className="text-gray-600">
            Присоединяйтесь к платформе и начните свой путь к успеху
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тип аккаунта
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
                  <input
                    {...register('role', { required: 'Выберите тип аккаунта' })}
                    type="radio"
                    value="customer"
                    className="mr-3 text-primary-600"
                  />
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-primary-600 mr-2" />
                    <span className="font-medium">Клиент</span>
                  </div>
                </label>
                <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
                  <input
                    {...register('role', { required: 'Выберите тип аккаунта' })}
                    type="radio"
                    value="business"
                    className="mr-3 text-primary-600"
                  />
                  <div className="flex items-center">
                    <Building2 className="h-5 w-5 text-primary-600 mr-2" />
                    <span className="font-medium">Бизнес</span>
                  </div>
                </label>
              </div>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>

            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                Имя
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('firstName', {
                    required: 'Имя обязательно',
                    minLength: {
                      value: 2,
                      message: 'Имя должно содержать минимум 2 символа'
                    }
                  })}
                  type="text"
                  id="firstName"
                  className="input pl-10"
                  placeholder="Введите имя"
                />
              </div>
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Фамилия
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('lastName', {
                    required: 'Фамилия обязательна',
                    minLength: {
                      value: 2,
                      message: 'Фамилия должна содержать минимум 2 символа'
                    }
                  })}
                  type="text"
                  id="lastName"
                  className="input pl-10"
                  placeholder="Введите фамилию"
                />
              </div>
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('email', {
                    required: 'Email обязателен',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Неверный формат email'
                    }
                  })}
                  type="email"
                  id="email"
                  className="input pl-10"
                  placeholder="your@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Телефон (необязательно)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('phone')}
                  type="tel"
                  id="phone"
                  className="input pl-10"
                  placeholder="+7 (999) 123-45-67"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('password', {
                    required: 'Пароль обязателен',
                    minLength: {
                      value: 6,
                      message: 'Пароль должен содержать минимум 6 символов'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="input pl-10 pr-10"
                  placeholder="Создайте пароль"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Подтвердите пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('confirmPassword', {
                    required: 'Подтверждение пароля обязательно',
                    validate: value => value === password || 'Пароли не совпадают'
                  })}
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  className="input pl-10 pr-10"
                  placeholder="Повторите пароль"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 text-lg"
            >
              {isLoading ? 'Создание аккаунта...' : 'Создать аккаунт'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Уже есть аккаунт?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Войти в систему
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm">
                ← Вернуться на главную
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
