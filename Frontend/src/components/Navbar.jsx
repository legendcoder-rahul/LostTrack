import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import './styles/navbar.css'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const [isDark, setIsDark] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark')
  }

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">
          <span className="logo-icon">📦</span>
          <span className="logo-text">LostTrack</span>
        </Link>
      </div>

      <div className={`nav-links ${showMobileMenu ? 'active' : ''}`}>
        <Link to="/" className="nav-link" onClick={() => setShowMobileMenu(false)}>Home</Link>
        <Link to="/how-it-works" className="nav-link" onClick={() => setShowMobileMenu(false)}>How it Works</Link>
        <Link to="/report" className="nav-link" onClick={() => setShowMobileMenu(false)}>Report Item</Link>
        <Link to="/recent" className="nav-link" onClick={() => setShowMobileMenu(false)}>Recent Items</Link>
        <Link to="/contact" className="nav-link" onClick={() => setShowMobileMenu(false)}>Contact</Link>
        
        {!isAuthenticated && (
          <>
            <div className="mobile-auth-divider"></div>
            <Link to="/login" className="nav-link nav-mobile-login" onClick={() => setShowMobileMenu(false)}>Login</Link>
            <Link to="/register" className="nav-link nav-mobile-signup" onClick={() => setShowMobileMenu(false)}>Sign Up</Link>
          </>
        )}
      </div>

      <div className="nav-right">
        {isAuthenticated && user ? (
          <div className="user-menu" style={{ position: 'relative' }}>
            <button 
              className="user-button"
              onClick={() => setShowUserMenu(!showUserMenu)}
              style={{
                padding: '8px 12px',
                background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600
              }}
            >
              👤 {user.name}
            </button>
            
            {showUserMenu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                background: 'white',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                minWidth: '180px',
                zIndex: 1000,
                marginTop: '8px'
              }}>
                <div style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid #eee',
                  fontSize: '12px',
                  color: '#666'
                }}>
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>{user.name}</div>
                  <div>{user.email}</div>
                </div>
                <Link 
                  to="/dashboard" 
                  className="nav-link"
                  style={{
                    display: 'block',
                    padding: '10px 16px',
                    borderBottom: '1px solid #eee',
                    textDecoration: 'none',
                    color: '#333'
                  }}
                >
                  📊 Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    border: 'none',
                    background: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: '#ff6b35',
                    fontSize: '14px',
                    fontWeight: 600
                  }}
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>

      <button 
        className="theme-toggle"
        onClick={toggleTheme} 
        title="Toggle Dark Mode"
      >
        {isDark ? '☀️' : '🌙'}
      </button>

      {!isAuthenticated && (
        <Link to="/login" className="nav-auth-desktop">Login</Link>
      )}

      <button 
        className={`hamburger-menu ${showMobileMenu ? 'active' : ''}`}
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        title="Toggle Menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </nav>
  )
}

export default Navbar