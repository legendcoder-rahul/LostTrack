import React, { useState } from 'react'
import { Link } from 'react-router'
import './styles/navbar.css'

const Navbar = () => {
  const [isDark, setIsDark] = useState(false)

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark')
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">
          <span className="logo-icon">📦</span>
          <span className="logo-text">LostTrack</span>
        </Link>
      </div>
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <a href="#how-it-works" className="nav-link">How it Works</a>
        <Link to="/report" className="nav-link">Report Item</Link>
        <a href="#recent" className="nav-link">Recent Items</a>
        <Link to="/contact" className="nav-link">Contact</Link>
      </div>
      <div className="nav-right">
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle Dark Mode">
          {isDark ? '☀️' : '🌙'}
        </button>
        <Link to="/login" className="nav-link">Login</Link>
        <Link to="/dashboard" className="btn-dashboard">Dashboard</Link>
      </div>
    </nav>
  )
}

export default Navbar