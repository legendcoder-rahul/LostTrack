import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import '../styles/auth.css'
import googleIcon from '../../../assets/google.png'
import { useAuth } from '../../../context/AuthContext'

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '', address: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [localError, setLocalError] = useState('')
  const { register, loading, error } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setLocalError('')
  }

  const validateForm = () => {
    if (!form.name || !form.email || !form.password || !form.confirmPassword || !form.phone) {
      setLocalError('All fields except address are required')
      return false
    }

    if (form.password !== form.confirmPassword) {
      setLocalError('Passwords do not match')
      return false
    }

    if (form.password.length < 6) {
      setLocalError('Password must be at least 6 characters')
      return false
    }

    if (!agreed) {
      setLocalError('Please agree to the Terms of Service and Privacy Policy')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')

    if (!validateForm()) {
      return
    }

    const registrationData = {
      name: form.name,
      email: form.email,
      password: form.password,
      confirmPassword: form.confirmPassword,
      phone: form.phone,
      address: form.address,
    }

    const result = await register(registrationData)

    if (result.success) {
      navigate('/dashboard')
    } else {
      setLocalError(result.error || 'Registration failed. Please try again.')
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
          <h1>Create Account</h1>
          <p className="auth-subtitle">Join LostTrack to start tracking lost items and reunite with your belongings.</p>

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
              <label>Full Name</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

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
              <label>Phone Number</label>
              <div className="input-wrapper">
                <span className="input-icon">📱</span>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+1 (234) 567-8900"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Address (Optional)</label>
              <div className="input-wrapper">
                <span className="input-icon">📍</span>
                <input
                  type="text"
                  name="address"
                  placeholder="123 Main Street, City, State"
                  value={form.address}
                  onChange={handleChange}
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

            <div className="form-group">
              <label>Confirm Password</label>
              <div className="input-wrapper">
                <span className="input-icon">✔️</span>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  {showConfirmPassword ? '👁️' : '🔙'}
                </button>
              </div>
            </div>

            <div className="form-checkbox">
              <input
                type="checkbox"
                id="agree"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                required
                disabled={loading}
              />
              <label htmlFor="agree">
                I agree to the <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>
              </label>
            </div>

            <button 
              type="submit" 
              className="btn-submit"
              disabled={loading}
              style={{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Creating Account...' : 'Create Account →'}
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
              Register with Google
            </button>
          </div>

          <p className="auth-footer">
            Already have an account? <Link to="/login" className="auth-link-orange">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register