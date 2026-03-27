import React, { createContext, useState, useEffect, useCallback } from 'react'
import authAPI from '../services/api'

// Create Auth Context
export const AuthContext = createContext(null)

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if user is already logged in (on app load)
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = authAPI.getToken()
        if (token) {
          // In production, verify token with backend
          // For now, we trust the stored token
          const userData = localStorage.getItem('user')
          if (userData) {
            setUser(JSON.parse(userData))
          }
        }
      } catch (err) {
        console.error('Auth check error:', err)
        authAPI.logout()
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Register function
  const register = useCallback(async (userData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authAPI.register(userData)

      if (response.token) {
        // Save user info to localStorage
        const userInfo = {
          id: response.userId,
          email: response.email,
          name: response.name,
          role: response.role,
        }
        setUser(userInfo)
        localStorage.setItem('user', JSON.stringify(userInfo))
        return { success: true, data: response }
      } else {
        setError(response.message || 'Registration failed')
        return { success: false, error: response.message }
      }
    } catch (err) {
      const errorMessage = err.message || 'Registration failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  // Login function
  const login = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authAPI.login({ email, password })

      if (response.token) {
        // Save user info to localStorage
        const userInfo = {
          id: response.userId,
          email: response.email,
          name: response.name,
          role: response.role,
        }
        setUser(userInfo)
        localStorage.setItem('user', JSON.stringify(userInfo))
        return { success: true, data: response }
      } else {
        setError(response.message || 'Login failed')
        return { success: false, error: response.message }
      }
    } catch (err) {
      const errorMessage = err.message || 'Login failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  // Logout function
  const logout = useCallback(() => {
    authAPI.logout()
    setUser(null)
    localStorage.removeItem('user')
    setError(null)
  }, [])

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    setError,
    clearError: () => setError(null),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use Auth Context
export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
