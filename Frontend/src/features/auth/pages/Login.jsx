import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import '../styles/auth.css'
import googleIcon from '../../../assets/google.png'
import { useAuth } from '../../../context/AuthContext'

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState('')
  const { login, loading, error } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setLocalError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!form.email || !form.password) {
      setLocalError('Both email and password are required')
      return
    }

    const result = await login(form.email, form.password)
    
    if (result.success) {
      navigate('/dashboard')
    } else {
      setLocalError(result.error || 'Login failed. Please try again.')
    }
  }

  const displayError = localError || error

  return (
    <div className="auth-wrapper">
      <div className="auth-header">
        <Link to="/" className="auth-logo">
          <span>🔍</span>
          <span>LostTrack</span>
        </Link>
      </div>

      <div className="auth-container">
        <div className="auth-content">
          <h1>Login</h1>
          <p className="auth-subtitle">Welcome back! Login to your LostTrack account to continue tracking your items.</p>

          {displayError && (
            <div className="error-banner" style={{
              backgroundColor: '#fee',
              border: '1px solid #fcc',
              color: '#c00',
              padding: '12px',
              borderRadius: '4px',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  name="email"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? '👁️' : '🔙'}
                </button>
              </div>
            </div>

            <div className="form-remember">
              <input type="checkbox" id="remember" disabled={loading} />
              <label htmlFor="remember">Remember me</label>
              <a href="#forgot" className="forgot-link">Forgot password?</a>
            </div>

            <button 
              type="submit" 
              className="btn-submit"
              disabled={loading}
              style={{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Logging in...' : 'Login →'}
            </button>
          </form>

          <div className="divider">OR</div>

          <div className="social-buttons">
            <button 
              type="button"
              className="btn-social google"
              disabled={loading}
            >
              <img className='googleIcon' src={googleIcon} alt="googleIcon" />
              Login with Google
            </button>
          </div>

          <p className="auth-footer">
            Don't have an account? <Link to="/register" className="auth-link-orange">Create one here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login