import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Calendar, Building2, Users, Clock, CheckCircle, Star } from 'lucide-react'

const HomePage = () => {
  const { user } = useAuth()

  const features = [
    {
      icon: <Calendar className="h-8 w-8 text-primary-600" />,
      title: 'Онлайн бронирование',
      description: 'Бронируйте услуги в любое время, из любого места'
    },
    {
      icon: <Building2 className="h-8 w-8 text-primary-600" />,
      title: 'Управление бизнесом',
      description: 'Легко управляйте расписанием и услугами вашего бизнеса'
    },
    {
      icon: <Users className="h-8 w-8 text-primary-600" />,
      title: 'Управление клиентами',
      description: 'Отслеживайте записи и управляйте клиентской базой'
    },
    {
      icon: <Clock className="h-8 w-8 text-primary-600" />,
      title: 'Автоматизация',
      description: 'Автоматические уведомления и напоминания'
    }
  ]

  const testimonials = [
    {
      name: 'Анна Петрова',
      role: 'Владелец салона красоты',
      content: 'Bereke Booking помог нам увеличить количество клиентов на 40% и упростить процесс записи.',
      rating: 5
    },
    {
      name: 'Михаил Иванов',
      role: 'Клиент',
      content: 'Очень удобно бронировать услуги. Всегда знаю, когда у меня запись и могу легко отменить.',
      rating: 5
    }
  ]

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-br from-primary-50 to-primary-100 rounded-3xl">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Современное бронирование для{' '}
            <span className="text-primary-600">вашего бизнеса</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Bereke Booking - это платформа, которая поможет вашему бизнесу расти, 
            а клиентам - легко находить и бронировать ваши услуги.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link to="/dashboard" className="btn-primary text-lg px-8 py-3">
                Перейти в дашборд
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary text-lg px-8 py-3">
                  Начать бесплатно
                </Link>
                <Link to="/login" className="btn-outline text-lg px-8 py-3">
                  Войти в систему
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Все что нужно для успешного бизнеса
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Наша платформа предоставляет все необходимые инструменты для 
            эффективного управления вашим бизнесом и привлечения новых клиентов.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Как это работает
          </h2>
          <p className="text-lg text-gray-600">
            Простой процесс настройки и использования платформы
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-600">1</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Зарегистрируйтесь
            </h3>
            <p className="text-gray-600">
              Создайте аккаунт и выберите тип пользователя
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-600">2</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Настройте бизнес
            </h3>
            <p className="text-gray-600">
              Добавьте информацию о вашем бизнесе и услугах
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-600">3</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Начинайте принимать клиентов
            </h3>
            <p className="text-gray-600">
              Клиенты смогут бронировать ваши услуги онлайн
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Что говорят наши пользователи
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">
                "{testimonial.content}"
              </p>
              <div>
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-16 bg-primary-600 rounded-2xl text-white">
        <h2 className="text-3xl font-bold mb-4">
          Готовы начать?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Присоединяйтесь к тысячам бизнесов, которые уже используют Bereke Booking
        </p>
        {user ? (
          <Link to="/dashboard" className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors">
            Перейти в дашборд
          </Link>
        ) : (
          <Link to="/register" className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors">
            Создать аккаунт бесплатно
          </Link>
        )}
      </section>
    </div>
  )
}

export default HomePage
