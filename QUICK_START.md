# 🚀 Быстрый запуск Bereke Booking

## Предварительные требования

- Node.js 18+ 
- MongoDB (локально или в облаке)
- npm или yarn

## Шаги для запуска

### 1. Установка зависимостей
```bash
npm run install:all
```

### 2. Настройка переменных окружения

**Backend** (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/bereke-booking
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Запуск MongoDB
```bash
# Локально
mongod

# Или используйте MongoDB Atlas для облачной базы
```

### 4. Запуск приложения
```bash
# Запуск фронтенда и бекенда одновременно
npm run dev

# Или по отдельности:
npm run dev:backend    # Backend на порту 5000
npm run dev:frontend   # Frontend на порту 3000
```

### 5. Откройте в браузере
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## Тестирование

1. Откройте http://localhost:3000
2. Зарегистрируйтесь как новый пользователь
3. Создайте бизнес (если выбрали роль "business")
4. Добавьте услуги и начните принимать бронирования

## Структура проекта

```
├── frontend/          # React приложение (порт 3000)
├── backend/           # Node.js API (порт 5000)
├── package.json       # Корневой package.json
└── README.md         # Полная документация
```

## Команды разработки

- `npm run dev` - запуск фронтенда и бекенда
- `npm run build` - сборка для продакшена
- `npm run dev:frontend` - только фронтенд
- `npm run dev:backend` - только бекенд
