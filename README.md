# Bereke Booking SAAS

Современное SAAS приложение для бронирования услуг маленьких бизнесов.

## 🚀 Возможности

- **Для бизнесов:**
  - Регистрация и управление профилем
  - Создание и настройка услуг
  - Управление расписанием работы
  - Просмотр и управление бронированиями
  - Аналитика и отчеты

- **Для клиентов:**
  - Поиск и выбор услуг
  - Онлайн бронирование
  - Управление своими записями
  - Уведомления о записях

## 🛠 Технологии

### Фронтенд
- React 18 + TypeScript
- Tailwind CSS
- React Router
- Axios
- React Hook Form
- React Query

### Бекенд
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT аутентификация
- bcrypt для хеширования
- nodemailer для email

## 📦 Установка

1. Клонируйте репозиторий
2. Установите зависимости:
   ```bash
   npm run install:all
   ```

3. Создайте `.env` файлы в папках `backend` и `frontend` на основе `env.example`

4. Убедитесь, что у вас установлена и запущена MongoDB

5. Запустите проект:
   ```bash
   npm run dev
   ```

## 🌐 Порты

- **Фронтенд:** http://localhost:3000
- **Бекенд:** http://localhost:5000

## 📁 Структура проекта

```
├── frontend/          # React приложение
├── backend/           # Node.js API
├── package.json       # Корневой package.json
└── README.md         # Документация
```

## 🔧 Разработка

- `npm run dev` - запуск фронтенда и бекенда
- `npm run dev:frontend` - только фронтенд
- `npm run dev:backend` - только бекенд
- `npm run build` - сборка для продакшена
