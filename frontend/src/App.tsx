import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import BusinessSetupPage from './pages/BusinessSetupPage'
import ServicesPage from './pages/ServicesPage'
import BookingsPage from './pages/BookingsPage'
import ProfilePage from './pages/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Публичные маршруты */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          
          {/* Защищенные маршруты */}
          <Route path="dashboard" element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          } />
          
          <Route path="business" element={
            <PrivateRoute requiredRole="business">
              <BusinessSetupPage />
            </PrivateRoute>
          } />
          
          <Route path="services" element={
            <PrivateRoute requiredRole="business">
              <ServicesPage />
            </PrivateRoute>
          } />
          
          <Route path="bookings" element={
            <PrivateRoute>
              <BookingsPage />
            </PrivateRoute>
          } />
          
          <Route path="profile" element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          } />
        </Route>
        
        {/* 404 страница */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
