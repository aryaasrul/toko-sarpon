import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../styles/login.css'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  
  const [nama, setNama] = useState('')
  const [kode, setKode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  
  const secretCode = "terang123"

  useEffect(() => {
    // Check if user has remember me
    const remembered = localStorage.getItem('posRememberMe') === 'true'
    
    if (remembered) {
      const savedName = localStorage.getItem('posUserName')
      if (savedName) {
        setNama(savedName)
        setRemember(true)
      }
    }
    
    // Check if already logged in
    const loggedIn = sessionStorage.getItem('posLoggedIn') === 'true'
    if (loggedIn) {
      navigate('/')
    }
  }, [navigate])

  const togglePassword = () => {
    setShowPassword(!showPassword)
  }

  const handleLogin = () => {
    const trimmedNama = nama.trim()
    
    // Validation
    if (!trimmedNama) {
      setErrorMessage("Silakan masukkan nama Anda")
      return
    }
    
    if (kode !== secretCode) {
      setErrorMessage("Kode rahasia salah")
      return
    }
    
    // Clear error
    setErrorMessage('')
    
    // Login
    login(trimmedNama, remember)
    
    // Navigate to loading
    navigate('/loading')
  }

  const handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
  }

  return (
    <div className="login-container">
      <h1>Part of Terang</h1>
      
      <div className="form-group">
        <label htmlFor="nama">Nama</label>
        <input 
          type="text" 
          id="nama" 
          placeholder="Your Name"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="kode">Kode</label>
        <div className="password-container">
          <input 
            type={showPassword ? "text" : "password"} 
            id="kode" 
            placeholder="Tulis Kode Rahasia Dari Mas Arya"
            value={kode}
            onChange={(e) => setKode(e.target.value)}
            onKeyUp={handleKeyUp}
          />
          <button 
            type="button" 
            className="toggle-password" 
            onClick={togglePassword}
          >
            <img 
              src={showPassword ? "/icons/eye-slash.svg" : "/icons/Show.svg"} 
              alt="Toggle Password" 
            />
          </button>
        </div>
      </div>

      <div className="remember-me">
        <input 
          type="checkbox" 
          id="remember"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
        />
        <label htmlFor="remember">Remember me?</label>
      </div>

      <button className="btn-login" onClick={handleLogin}>
        Masuk geys
      </button>
      
      {errorMessage && (
        <p className="error-message" style={{ display: 'block' }}>
          {errorMessage}
        </p>
      )}
    </div>
  )
}

export default Login