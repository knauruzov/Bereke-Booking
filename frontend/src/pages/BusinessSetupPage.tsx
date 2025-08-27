import { Building2 } from 'lucide-react'

const BusinessSetupPage = () => {
  return (
    <div className="text-center py-20">
      <Building2 className="h-16 w-16 text-primary-600 mx-auto mb-6" />
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Настройка бизнеса
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Эта страница будет содержать форму для создания и настройки вашего бизнеса.
        Здесь вы сможете добавить информацию о компании, услугах и рабочем времени.
      </p>
    </div>
  )
}

export default BusinessSetupPage
