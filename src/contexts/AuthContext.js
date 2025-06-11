import React, { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const loggedIn = sessionStorage.getItem('posLoggedIn') === 'true'
    const userName = sessionStorage.getItem('posUserName')
    
    if (loggedIn && userName) {
      setUser({ name: userName })
    }
    
    setLoading(false)
  }, [])

  const login = (name, remember) => {
    // Save to session
    sessionStorage.setItem('posLoggedIn', 'true')
    sessionStorage.setItem('posUserName', name)
    
    // Save to localStorage if remember me
    if (remember) {
      localStorage.setItem('posUserName', name)
      localStorage.setItem('posRememberMe', 'true')
    }
    
    setUser({ name })
  }

  const logout = () => {
    // Clear session
    sessionStorage.removeItem('posLoggedIn')
    sessionStorage.removeItem('posUserName')
    
    // Clear localStorage
    localStorage.removeItem('posLoggedIn')
    localStorage.removeItem('posUserName')
    
    setUser(null)
  }

  const value = {
    user,
    login,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}