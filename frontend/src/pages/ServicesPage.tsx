import { Calendar } from 'lucide-react'

const ServicesPage = () => {
  return (
    <div className="text-center py-20">
      <Calendar className="h-16 w-16 text-primary-600 mx-auto mb-6" />
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Управление услугами
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Здесь вы сможете создавать, редактировать и управлять услугами вашего бизнеса.
        Добавляйте новые услуги, устанавливайте цены и настраивайте расписание.
      </p>
    </div>
  )
}

export default ServicesPage
