import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import Login from './pages/Login'
import Loading from './pages/Loading'
import Kasir from './pages/Kasir'
// import Katalog from './pages/Katalog'
// import BeansManagement from './pages/BeansManagement'
// import Riwayat from './pages/Riwayat'

// Global styles
import './styles/style.css'
import './styles/animations.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/loading" element={<Loading />} />
          
          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Kasir />
            </ProtectedRoute>
          } />
          
          {/* Uncomment as we create these pages */}
          {/* <Route path="/katalog" element={
            <ProtectedRoute>
              <Katalog />
            </ProtectedRoute>
          } /> */}
          
          {/* <Route path="/beans-management" element={
            <ProtectedRoute>
              <BeansManagement />
            </ProtectedRoute>
          } /> */}
          
          {/* <Route path="/riwayat" element={
            <ProtectedRoute>
              <Riwayat />
            </ProtectedRoute>
          } /> */}
          
          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App