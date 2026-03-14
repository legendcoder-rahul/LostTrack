import React, { useState } from 'react'
import { Link } from 'react-router'
import '../styles/auth.css'

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Login:', form)
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-header">
        <Link to="/" className="auth-logo">
          <span>🔍</span>
          <span>LostTrack</span>
        </Link>
        <div className="auth-header-right">
          <span>Don't have an account?</span>
          <Link to="/register" className="auth-link">Register</Link>
        </div>
      </div>

      <div className="auth-container">
        <div className="auth-content">
          <h1>Login</h1>
          <p className="auth-subtitle">Welcome back! Login to your FoundTrack account to continue tracking your items.</p>

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

            <div className="form-remember">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
              <a href="#forgot" className="forgot-link">Forgot password?</a>
            </div>

            <button type="submit" className="btn-submit">Login →</button>
          </form>

          <div className="divider">OR LOGIN WITH</div>

          <div className="social-buttons">
            <button className="btn-social google">Google</button>
            <button className="btn-social sso">🔐 SSO</button>
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