import { User } from 'lucide-react'

const ProfilePage = () => {
  return (
    <div className="text-center py-20">
      <User className="h-16 w-16 text-primary-600 mx-auto mb-6" />
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Профиль пользователя
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Здесь вы сможете редактировать свой профиль, изменить пароль
        и управлять настройками аккаунта.
      </p>
    </div>
  )
}

export default ProfilePage
