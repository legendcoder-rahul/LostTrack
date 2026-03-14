
import { Link } from 'react-router'
import './styles/home.css'

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Reconnecting You with</h1>
          <h1 className="hero-title highlight">Your Belongings</h1>
          <p className="hero-subtitle">
            The ultimate lost and found management system designed for businesses, venues,
            <br />
            and communities. Simple, transparent, and built on trust.
          </p>
          <div className="hero-actions">
            <Link to="/report">
              <button className="btn btn-primary">Report Lost Item</button>
            </Link>
            <Link to="/found">
              <button className="btn btn-success">Report Found Item</button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works" id="how-it-works">
        <div className="section-inner">
          <h2>How It Works</h2>
          <p className="section-subtitle">A simple 3-step process to recover what you've lost.</p>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Report</h3>
              <p>Submit a detailed report of the item you lost or found, including photos and location details.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Match</h3>
              <p>Our smart algorithm scans the database to find potential matches and notifies the involved parties.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Recover</h3>
              <p>Once a match is verified, we facilitate a secure process for returning the item to its rightful owner.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Reported Items Section */}
      <section className="recent-items" id="recent">
        <div className="section-inner">
          <div className="section-header">
            <h2>Recently Reported Items</h2>
            <a href="#" className="view-all">View all listings →</a>
          </div>
          <p className="section-subtitle">Help someone find their belongings or check if your item was turned in.</p>
          
          <div className="items-grid">
            <div className="item-card lost">
              <div className="item-image" style={{background: '#f5deb3'}}></div>
              <span className="item-badge">LOST</span>
              <h4>Silver iPhone 13</h4>
              <p className="item-meta">Central Park East • 2 hrs ago</p>
            </div>

            <div className="item-card found">
              <div className="item-image" style={{background: '#2d5016'}}></div>
              <span className="item-badge found">FOUND</span>
              <h4>Car Keys w/ Blue Tag</h4>
              <p className="item-meta">Starbucks Plaza • 5 hrs ago</p>
            </div>

            <div className="item-card lost">
              <div className="item-image" style={{background: '#2f2f2f'}}></div>
              <span className="item-badge\">LOST</span>
              <h4>Leather Wallet</h4>
              <p className="item-meta">Metro Station • 1 day ago</p>
            </div>

            <div className="item-card found">
              <div className="item-image\" style={{background: '#1a1a1a'}}></div>
              <span className="item-badge found\">FOUND</span>
              <h4>North Face Backpack</h4>
              <p className="item-meta\">Public Library • 2 days ago</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home