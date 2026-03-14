import React, { useState } from 'react'
import { Link } from 'react-router'
import '../styles/auth.css'

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreed, setAgreed] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Register:', form)
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-header">
        <Link to="/" className="auth-logo">
          <span>🔍</span>
          <span>LostTrack</span>
        </Link>
        <div className="auth-header-right">
          <span>Already have an account?</span>
          <Link to="/login" className="auth-link">Login</Link>
        </div>
      </div>

      <div className="auth-container">
        <div className="auth-content">
          <h1>Create Account</h1>
          <p className="auth-subtitle">Join FoundTrack to start tracking lost items and reunite with your belongings.</p>

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
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
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
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
              />
              <label htmlFor="agree">
                I agree to the <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>
              </label>
            </div>

            <button type="submit" className="btn-submit">Create Account →</button>
          </form>

          <div className="divider">OR REGISTER WITH</div>

          <div className="social-buttons">
            <button className="btn-social google">Google</button>
            <button className="btn-social sso">🔐 SSO</button>
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