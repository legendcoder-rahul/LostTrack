import React, { useState } from 'react'
import { Link } from 'react-router'
import './styles/dashboard.css'

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')

  const stats = [
    { label: 'TOTAL LOST', value: '1,284', trend: '↓ 12%', icon: '🔴', color: 'red' },
    { label: 'TOTAL FOUND', value: '942', trend: '↗ 8%', icon: '📦', color: 'blue' },
    { label: 'ACTIVE MATCHES', value: '156', trend: '⚡ High Match Rate', icon: '✨', color: 'orange', highlight: true },
    { label: 'RECOVERED ITEMS', value: '432', trend: '↗ 24%', icon: '✅', color: 'green' },
  ]

  const recentListings = [
    { id: 1, name: 'iPhone 13 Pro', description: 'Sierra blue, Clear case', status: 'LOST', date: 'Oct 24, 2023', location: 'Central Station' },
    { id: 2, name: 'Leather Wallet', description: 'Brown, Fossil brand', status: 'FOUND', date: 'Oct 23, 2023', location: 'Airport Terminal 2' },
    { id: 3, name: 'Keychain', description: 'Tesla key, Red tag', status: 'FOUND', date: 'Oct 23, 2023', location: 'City Mall Park' },
    { id: 4, name: 'Laptop Bag', description: 'Dell branding, black nylon', status: 'LOST', date: 'Oct 22, 2023', location: 'Starbucks Downtown' },
  ]

  const matchAlerts = [
    { confidence: '98% MATCH CONFIDENCE', item: 'Apple AirPods Pro', description: 'Matching serial number prefix detected in found item #4291', time: '2h ago', action: 'Verify Match' },
    { confidence: '85% MATCH CONFIDENCE', item: 'Blue Backpack (Eastpak)', description: 'Location proximity (0.2km) and visual color match found.', time: '5h ago', action: 'Review' },
    { confidence: '72% MATCH CONFIDENCE', item: 'Ray-Ban Sunglasses', description: 'Multiple black frames reported at Central Park area.', time: 'Yesterday', action: 'Review' },
  ]

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">

        <nav className="sidebar-nav">
          <div className="nav-section">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'lost', label: 'Lost Items', icon: '🔴' },
              { id: 'found', label: 'Found Items', icon: '📦' },
              { id: 'matches', label: 'Matches', icon: '🔗', badge: true },
            ].map(item => (
              <button
                key={item.id}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && <span className="badge">8</span>}
              </button>
            ))}
          </div>

          <div className="nav-section">
            <div className="nav-label">SYSTEM</div>
            {[
              { id: 'users', label: 'Users', icon: '👥' },
              { id: 'settings', label: 'Settings', icon: '⚙️' },
            ].map(item => (
              <button
                key={item.id}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="sidebar-user">
          <div className="user-avatar">👤</div>
          <div className="user-info">
            <div className="user-name">Alex Rivera</div>
            <div className="user-role">Administrator</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Top Bar */}
        <div className="dashboard-top">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search items, locations, or claim IDs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="top-actions">
            <button className="icon-btn" title="Notifications">🔔</button>
            <button className="icon-btn" title="Help">❓</button>
            <button className="btn-new-entry">+ New Entry</button>
          </div>
        </div>

        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1>Dashboard Overview</h1>
            <p className="page-subtitle">Welcome back, Alex. Here's a summary of the latest tracker activity.</p>
          </div>
          <div className="header-actions">
            <button className="btn-secondary">📅 Last 30 Days</button>
            <button className="btn-secondary">⬇️ Export Data</button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          {stats.map((stat, idx) => (
            <div key={idx} className={`stat-card ${stat.highlight ? 'highlight' : ''}`}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-content">
                <div className="stat-label">{stat.label}</div>
                <div className="stat-value">{stat.value}</div>
              </div>
              <div className={`stat-trend ${stat.color}`}>{stat.trend}</div>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="content-grid">
          {/* Recent Listings */}
          <div className="recent-listings">
            <div className="section-header">
              <h2>Recent Listings</h2>
              <a href="#" className="view-all">View All</a>
            </div>
            <table className="listings-table">
              <thead>
                <tr>
                  <th>ITEM DETAILS</th>
                  <th>STATUS</th>
                  <th>DATE</th>
                  <th>LOCATION</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recentListings.map((listing) => (
                  <tr key={listing.id}>
                    <td>
                      <div className="item-cell">
                        <span className="item-icon">📋</span>
                        <div>
                          <div className="item-name">{listing.name}</div>
                          <div className="item-description">{listing.description}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${listing.status.toLowerCase()}`}>
                        {listing.status}
                      </span>
                    </td>
                    <td className="date-cell">{listing.date}</td>
                    <td className="location-cell">📍 {listing.location}</td>
                    <td>
                      <button className="btn-menu">⋮</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Match Alerts */}
          <div className="match-alerts">
            <div className="section-header">
              <h2>Match Alerts</h2>
              <span className="badge-new">🆕 New</span>
            </div>
            <div className="alerts-list">
              {matchAlerts.map((alert, idx) => (
                <div key={idx} className="alert-item">
                  <div className="alert-confidence">{alert.confidence}</div>
                  <h3 className="alert-title">{alert.item}</h3>
                  <p className="alert-description">{alert.description}</p>
                  <div className="alert-time">{alert.time}</div>
                  <button className="btn-alert-action">{alert.action}</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Trends */}
        <div className="activity-trends">
          <div className="section-header">
            <h2>Activity Trends</h2>
            <div className="legend">
              <span className="legend-item"><span className="dot red"></span> Lost Items</span>
              <span className="legend-item"><span className="dot blue"></span> Found Items</span>
            </div>
          </div>
          <div className="chart-placeholder">
            📊 Activity chart will be rendered here
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
