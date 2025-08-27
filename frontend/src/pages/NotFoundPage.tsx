import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

const NotFoundPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Страница не найдена
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          К сожалению, запрашиваемая страница не существует или была перемещена.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Home className="h-5 w-5" />
            <span>На главную</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-outline inline-flex items-center space-x-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Назад</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
