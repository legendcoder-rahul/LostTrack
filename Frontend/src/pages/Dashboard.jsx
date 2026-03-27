import React, { useState, useEffect } from 'react'
import { Link } from 'react-router'
import './styles/dashboard.css'

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [lostCount, setLostCount] = useState(0)
  const [foundCount, setFoundCount] = useState(0)
  const [claimedItems, setClaimedItems] = useState([])
  const [allItems, setAllItems] = useState([])
  const [userName, setUserName] = useState('Rahul Kumar')

  // Fetch real data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/items')
        const items = await response.json()
        
        setAllItems(items)
        const lostItems = items.filter(item => item.status === 'LOST').length
        const foundItems = items.filter(item => item.status === 'FOUND').length
        
        setLostCount(lostItems)
        setFoundCount(foundItems)
      } catch (error) {
        console.error('Error fetching items:', error)
      }
    }

    fetchData()

    // Load claimed items from localStorage
    const storedClaims = JSON.parse(localStorage.getItem('claims') || '[]')
    setClaimedItems(storedClaims)

    // Load user name from localStorage if available
    const storedUserName = localStorage.getItem('userName')
    if (storedUserName) {
      setUserName(storedUserName)
    }
  }, [])

  const stats = [
    { label: 'Active Lost Reports', value: lostCount.toString(), trend: '📍 Open Cases', icon: '🔴', color: 'red' },
    { label: 'Active Found Reports', value: foundCount.toString(), trend: '📦 Available', icon: '📦', color: 'blue' },
    { label: 'Successfully Claimed', value: claimedItems.length.toString(), trend: '✅ Returned', icon: '✅', color: 'green', highlight: true },
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
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
  

        <div className="page-header">
          <div>
            <h1>Dashboard Overview</h1>
            <p className="page-subtitle">Welcome back, {userName}. Here's what's happening with your items.</p>
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

        {/* Content Grid - Dynamic based on tab */}
        <div className="content-grid">
          {activeTab === 'overview' && (
            <div className="recent-listings">
              <div className="section-header">
                <h2>Claimed Items</h2>
                <Link to="/recent-items" className="view-all">View All Items</Link>
              </div>
              {claimedItems.length > 0 ? (
                <table className="listings-table">
                  <thead>
                    <tr>
                      <th>ITEM DETAILS</th>
                      <th>STATUS</th>
                      <th>CLAIMED DATE</th>
                      <th>USER CONTACT</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {claimedItems.map((claim) => (
                      <tr key={claim.itemId}>
                        <td>
                          <div className="item-cell">
                            <span className="item-icon">📦</span>
                            <div>
                              <div className="item-name">{claim.itemTitle}</div>
                              <div className="item-description">Claim ID: {claim.itemId}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`status-badge ${claim.itemStatus.toLowerCase()}`}>
                            {claim.itemStatus}
                          </span>
                        </td>
                        <td className="date-cell">{claim.claimTime}</td>
                        <td className="location-cell">
                          {claim.userEmail && <div>📧 {claim.userEmail}</div>}
                          {claim.userPhone && <div>📱 {claim.userPhone}</div>}
                        </td>
                        <td>
                          <button className="btn-menu">⋮</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state">
                  <p className="empty-icon">📭</p>
                  <p className="empty-text">No claimed items yet. Visit <Link to="/recent-items">Recent Items</Link> to claim found items.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'lost' && (
            <div className="recent-listings">
              <div className="section-header">
                <h2>Lost Items</h2>
              </div>
              {allItems.filter(item => item.status === 'LOST').length > 0 ? (
                <table className="listings-table">
                  <thead>
                    <tr>
                      <th>ITEM DETAILS</th>
                      <th>LOCATION</th>
                      <th>DATE REPORTED</th>
                      <th>REPORTER CONTACT</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {allItems.filter(item => item.status === 'LOST').map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="item-cell">
                            <span className="item-icon">🔴</span>
                            <div>
                              <div className="item-name">{item.title}</div>
                              <div className="item-description">{item.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="location-cell">📍 {item.location}</td>
                        <td className="date-cell">{new Date(item.reportedDate).toLocaleDateString()}</td>
                        <td className="location-cell">
                          {item.contactInfo && <div>📧/📱 {item.contactInfo}</div>}
                        </td>
                        <td>
                          <button className="btn-menu">⋮</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state">
                  <p className="empty-icon">✅</p>
                  <p className="empty-text">No lost items reported. Great!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'found' && (
            <div className="recent-listings">
              <div className="section-header">
                <h2>Found Items</h2>
              </div>
              {allItems.filter(item => item.status === 'FOUND').length > 0 ? (
                <table className="listings-table">
                  <thead>
                    <tr>
                      <th>ITEM DETAILS</th>
                      <th>LOCATION</th>
                      <th>DATE FOUND</th>
                      <th>FINDER CONTACT</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {allItems.filter(item => item.status === 'FOUND').map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="item-cell">
                            <span className="item-icon">📦</span>
                            <div>
                              <div className="item-name">{item.title}</div>
                              <div className="item-description">{item.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="location-cell">📍 {item.location}</td>
                        <td className="date-cell">{new Date(item.reportedDate).toLocaleDateString()}</td>
                        <td className="location-cell contact-info">
                          {item.contactInfo && (
                            <>
                              <div>📧/📱 {item.contactInfo}</div>
                            </>
                          )}
                        </td>
                        <td>
                          <button className="btn-menu">⋮</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state">
                  <p className="empty-icon">📭</p>
                  <p className="empty-text">No found items reported yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard
