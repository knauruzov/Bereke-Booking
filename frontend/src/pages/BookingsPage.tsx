import { Clock } from 'lucide-react'

const BookingsPage = () => {
  return (
    <div className="text-center py-20">
      <Clock className="h-16 w-16 text-primary-600 mx-auto mb-6" />
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Бронирования
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Здесь вы сможете просматривать и управлять всеми бронированиями.
        Отслеживайте статус записей, подтверждайте или отменяйте их.
      </p>
    </div>
  )
}

export default BookingsPage
