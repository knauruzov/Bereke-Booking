import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Calendar, User, Building2, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

const Header = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Логотип */}
          <Link to="/" className="flex items-center space-x-2">
            <Calendar className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">Bereke Booking</span>
          </Link>

          {/* Десктопная навигация */}
          <nav className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Дашборд
                </Link>
                
                {user.role === 'business' && (
                  <>
                    <Link
                      to="/business"
                      className="text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      Мой бизнес
                    </Link>
                    <Link
                      to="/services"
                      className="text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      Услуги
                    </Link>
                  </>
                )}
                
                <Link
                  to="/bookings"
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Бронирования
                </Link>
                
                <Link
                  to="/profile"
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Профиль
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Войти
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Регистрация
                </Link>
              </>
            )}
          </nav>

          {/* Мобильное меню кнопка */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-primary-600 hover:bg-gray-100"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Мобильное меню */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-600 hover:text-primary-600 transition-colors px-4 py-2 rounded-md hover:bg-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Дашборд
                  </Link>
                  
                  {user.role === 'business' && (
                    <>
                      <Link
                        to="/business"
                        className="text-gray-600 hover:text-primary-600 transition-colors px-4 py-2 rounded-md hover:bg-gray-100"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Мой бизнес
                      </Link>
                      <Link
                        to="/services"
                        className="text-gray-600 hover:text-primary-600 transition-colors px-4 py-2 rounded-md hover:bg-gray-100"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Услуги
                      </Link>
                    </>
                  )}
                  
                  <Link
                    to="/bookings"
                    className="text-gray-600 hover:text-primary-600 transition-colors px-4 py-2 rounded-md hover:bg-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Бронирования
                  </Link>
                  
                  <Link
                    to="/profile"
                    className="text-gray-600 hover:text-primary-600 transition-colors px-4 py-2 rounded-md hover:bg-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Профиль
                  </Link>
                  
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMobileMenuOpen(false)
                    }}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-700 px-4 py-2 rounded-md hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Выйти</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-primary-600 transition-colors px-4 py-2 rounded-md hover:bg-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Войти
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary w-full text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Регистрация
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
