import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/landing/LandingPage'
import ChatPage from './pages/chat/ChatPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}

export default App
