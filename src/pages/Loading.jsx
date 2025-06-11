import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../styles/loading.css'

const Loading = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      navigate('/login')
      return
    }
    
    // Simulate loading (3 seconds)
    const timer = setTimeout(() => {
      navigate('/')
    }, 3000)

    return () => clearTimeout(timer)
  }, [navigate, user])

  return (
    <div className="loading-container">
      <div className="logo">
        <img src="/logo/logo.png" alt="Logo Terang" width="80" height="80" />
      </div>

      <div className="loading-spinner"></div>
      
      <p className="loading-text">Tunggu, masih loading</p>
    </div>
  )
}

export default Loading