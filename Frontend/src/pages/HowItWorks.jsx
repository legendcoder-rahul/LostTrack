import { Link } from 'react-router'
import './styles/how-it-works.css'

const HowItWorks = () => {
  return (
    <div className="how-it-works-page">
      {/* Header */}
      <div className="how-header">
        <h1>How it Works</h1>
        <p>Whether you've lost a precious memory or found someone else's treasure, LostTrack is the bridge that brings them back home.</p>
      </div>

      {/* Lost an Item Section */}
      <section className="journey-section lost-section">
        <div className="section-container">
          <div className="section-label">THE JOURNEY BACK</div>
          <h2>Lost an Item?</h2>
          <p className="section-description">
            We use advanced AI matching and a global network of digital custodians to help you find what's missing.
          </p>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-icon">🔵</div>
              <h3>Step 1: Report</h3>
              <p>Provide detailed descriptions, lost known locations, and upload clear photos to help our system identify your item.</p>
            </div>

            <div className="step-card">
              <div className="step-icon">🔍</div>
              <h3>Step 2: Match</h3>
              <p>Our AI scans thousands of found reports in real-time, looking for potential visual and contextual matches instantly.</p>
            </div>

            <div className="step-card">
              <div className="step-icon">💎</div>
              <h3>Step 3: Reunite</h3>
              <p>Coordinate a safe reunion through our encrypted messaging or drop-off at one of our verified partner locations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Found an Item Section */}
      <section className="journey-section found-section">
        <div className="section-container">
          <div className="section-label">BE A HERO</div>
          <h2>Found an Item?</h2>
          <p className="section-description">
            Your integrity matters. Follow these simple steps to help someone reclaim their lost property securely.
          </p>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-icon">📸</div>
              <h3>Step 1: Post</h3>
              <p>Snap a clear photo of the item and jot down the location where it was discovered to help us narrow the search.</p>
            </div>

            <div className="step-card">
              <div className="step-icon">🔐</div>
              <h3>Step 2: Validate</h3>
              <p>Our team and algorithms verify owner claims through specific identifying questions to ensure the right person gets it.</p>
            </div>

            <div className="step-card">
              <div className="step-icon">🤝</div>
              <h3>Step 3: Return</h3>
              <p>Drop the item at a secure partner, look or coordinate a safe meeting. We reward our finders for helping.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Built on Trust Section */}
      <section className="trust-section">
        <div className="section-container">
          <h2>Built on Trust</h2>
          <p className="section-description">
            We prioritize your security and privacy at every step of the reunion process.
          </p>

          <div className="trust-grid">
            <div className="trust-card identity">
              <div className="trust-icon">🔐</div>
              <h3>Identity Verification</h3>
              <p>LostTrack integrates a multi-layered verification process to ensure a community of genuine, helpful people.</p>
            </div>

            <div className="trust-card secure-messaging">
              <div className="trust-icon">💬</div>
              <h3>Secure Messaging</h3>
              <p>Communicate safely without ever sharing your personal phone number or private email addresses.</p>
            </div>

            <div className="trust-card verified">
              <div className="trust-icon">✅</div>
              <h3>Verified Safe Points</h3>
              <p>Access a network of thousands of verified physical drop-off locations. From police stations to retail partners.</p>
            </div>

            <div className="trust-card privacy">
              <div className="trust-icon">🔒</div>
              <h3>Privacy First</h3>
              <p>Your location data is encrypted and only shared with necessary parties once a match is 100% verified.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-reunion">
        <div className="cta-content">
          <h2>Ready to start the reunion?</h2>
          <div className="cta-buttons">
            <Link to="/report">
              <button className="cta-btn primary">Report Lost Item</button>
            </Link>
            <Link to="/found">
              <button className="cta-btn secondary">Report Found Item</button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HowItWorks
