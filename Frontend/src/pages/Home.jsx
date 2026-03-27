
import { Link } from 'react-router'
import './styles/home.css'
import img from '../assets/hero.jfif'

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-wrapper">
          <div className="hero-content">
            <p className="hero-tag">🔍 TRACKING LOST FOUND ITEMS</p>
            <h1 className="hero-title">
              Reconnecting You<br />
              <span className="highlight">with Your<br />Belongings.</span>
            </h1>
            <p className="hero-subtitle">
              The ultimate lost and found management system designed for businesses, venues, and communities. Simple, transparent, and built on trust.
            </p>
            <div className="hero-actions">
              <Link to="/report">
                <button className="btn btn-primary">📍 Report Lost Item</button>
              </Link>
              <Link to="/found">
                <button className="btn btn-secondary">📦 Report Found Item</button>
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-image-placeholder">
              <div className="office-mockup">
                <div className="window-frame"><img className='img' src={img} alt="Hero Image" /></div>
              </div>
              <div className="card-overlay">
                <div className="card-header">🔔 Item Recovered!</div>
                <div className="card-content">
                  <p className="card-title">Case Closed • May 12</p>
                  <p className="card-detail">Your Wallet Found</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How LostTrack Works Section */}
      <section className="how-losttrack-works">
        <div className="section-inner">
          <h2 className="section-title">How LostTrack Works</h2>
          <p className="section-subtitle">We've streamlined the journey from "lost" to "found" through a secure, smart-first approach that prioritizes community and clarity.</p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3>Report & Catalog</h3>
              <p>Users or staff submit a detailed report with photos and location markers. Our system automatically categorizes and tags the entry.</p>
              <a href="#" className="learn-more">Learn more →</a>
            </div>

            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h3>Smart Matching</h3>
              <p>Our proprietary algorithm cross-references descriptions and visual data across our entire network of partner venues.</p>
              <a href="#" className="learn-more">How it works →</a>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Return</h3>
              <p>Once found, the right person receives secure handover instructions or shipping can be arranged and monitored.</p>
              <a href="#" className="learn-more">Security details →</a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="section-inner">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">94%</div>
              <div className="stat-label">Recovery Rate</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">12k+</div>
              <div className="stat-label">Items Matched</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">500+</div>
              <div className="stat-label">Partner Venues</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">&lt; 2h</div>
              <div className="stat-label">Avg Match Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Designed for Every Scale Section */}
      <section className="designed-for-scale">
        <div className="section-inner">
          <h2 className="section-title">Designed for Every Scale</h2>
          
          <div className="scale-grid">
            <div className="scale-card enterprise">
              <h3>Enterprise Venues</h3>
              <p>Multi-location management with brand logos, audit logs, and detailed API interfaces for seamless integration.</p>
            </div>

            <div className="scale-card security">
              <h3>Military-Grade Privacy</h3>
              <p>Your data is encrypted end-to-end. We never share personal data without explicit customer consent.</p>
            </div>

            <div className="scale-card qr">
              <h3>QR Integration</h3>
              <p>Smart tagging system. Just scan the QR code on a tag or reporting form to automatically capture in a device.</p>
            </div>

            <div className="scale-card community">
              <h3>Community Focused</h3>
              <p>Built on transparency, Localisation feature helps people within the region share a vision of helping each other.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to bring order to the<br />chaos?</h2>
          <p>Join thousands of organizations making this world a little more found, one item at a time.</p>
          <div className="cta-buttons">
            <button className="cta-btn primary">Get Started For Free</button>
            <button className="cta-btn secondary">Schedule a Demo</button>
          </div>
        </div>
      </section>

 
    </div>
  )
}

export default Home