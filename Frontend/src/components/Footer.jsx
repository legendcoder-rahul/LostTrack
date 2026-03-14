import React from 'react'
import { Link } from 'react-router'
import './styles/footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-logo">
            <span className="footer-logo-icon">📦</span>
            <span className="footer-logo-text">LostTrack</span>
          </div>
          <p className="footer-description">
            The world's most trusted lost and found network.<br />
            Making item recovery stress-free for everyone.
          </p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><Link to="/report">Report Item</Link></li>
            <li><a href="#recent">Recent Items</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Legal</h4>
          <ul className="footer-links">
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms of Service</a></li>
            <li><a href="#security">Security</a></li>
            <li><a href="#cookies">Cookie Policy</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Connect</h4>
          <div className="social-links">
            <a href="#twitter" className="social-icon" title="Twitter">𝕏</a>
            <a href="#facebook" className="social-icon" title="Facebook">f</a>
            <a href="#instagram" className="social-icon" title="Instagram">📷</a>
            <a href="#linkedin" className="social-icon" title="LinkedIn">in</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 LostTrack Inc. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
