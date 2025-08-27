import { useAuth } from '../contexts/AuthContext'
import { Calendar, Users, Clock, TrendingUp, Building2, User } from 'lucide-react'

const DashboardPage = () => {
  const { user } = useAuth()

  const stats = [
    {
      title: 'Всего бронирований',
      value: '12',
      change: '+2',
      changeType: 'positive',
      icon: <Calendar className="h-6 w-6" />
    },
    {
      title: 'Активные клиенты',
      value: '8',
      change: '+1',
      changeType: 'positive',
      icon: <Users className="h-6 w-6" />
    },
    {
      title: 'Часы работы',
      value: '156',
      change: '+12',
      changeType: 'positive',
      icon: <Clock className="h-6 w-6" />
    },
    {
      title: 'Доход',
      value: '₸45,600',
      change: '+8.2%',
      changeType: 'positive',
      icon: <TrendingUp className="h-6 w-6" />
    }
  ]

  const recentBookings = [
    {
      id: 1,
      customer: 'Анна Петрова',
      service: 'Стрижка',
      date: '2024-01-15',
      time: '14:00',
      status: 'confirmed'
    },
    {
      id: 2,
      customer: 'Михаил Иванов',
      service: 'Массаж',
      date: '2024-01-16',
      time: '10:00',
      status: 'pending'
    },
    {
      id: 3,
      customer: 'Елена Сидорова',
      service: 'Маникюр',
      date: '2024-01-14',
      time: '16:00',
      status: 'completed'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Подтверждено'
      case 'pending':
        return 'Ожидает'
      case 'completed':
        return 'Завершено'
      default:
        return status
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white">
        <div className="flex items-center space-x-4">
          <div className="bg-white/20 p-3 rounded-full">
            {user?.role === 'business' ? (
              <Building2 className="h-8 w-8" />
            ) : (
              <User className="h-8 w-8" />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              Добро пожаловать, {user?.firstName}!
            </h1>
            <p className="text-primary-100 text-lg">
              {user?.role === 'business' 
                ? 'Управляйте своим бизнесом и привлекайте новых клиентов'
                : 'Найдите и забронируйте лучшие услуги'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="p-3 bg-primary-100 rounded-lg text-primary-600">
                {stat.icon}
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 ml-2">с прошлой недели</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Недавние бронирования</h2>
        </div>
        <div className="p-6">
          {recentBookings.length > 0 ? (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{booking.customer}</p>
                      <p className="text-sm text-gray-600">{booking.service}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {new Date(booking.date).toLocaleDateString('ru-RU')} в {booking.time}
                    </p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                      {getStatusText(booking.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Пока нет бронирований</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Быстрые действия</h3>
          <div className="space-y-3">
            {user?.role === 'business' ? (
              <>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Building2 className="h-5 w-5 text-primary-600" />
                    <span>Управление бизнесом</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-primary-600" />
                    <span>Добавить услугу</span>
                  </div>
                </button>
              </>
            ) : (
              <>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-primary-600" />
                    <span>Найти услуги</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-primary-600" />
                    <span>Мои записи</span>
                  </div>
                </button>
              </>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Активность</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Новые клиенты</span>
              <span className="text-sm font-medium text-gray-900">+3</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Завершенные услуги</span>
              <span className="text-sm font-medium text-gray-900">8</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Отзывы</span>
              <span className="text-sm font-medium text-gray-900">+2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
