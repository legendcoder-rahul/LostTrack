import React, { useState, useEffect } from 'react'
import './styles/recent-items.css'

const RecentItems = () => {
  const [filter, setFilter] = useState('all')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchItems()
  }, [filter])

  const handleClaim = (item) => {
    // Store claimed item with user details
    const claims = JSON.parse(localStorage.getItem('claims') || '[]')
    const newClaim = {
      itemId: item.id,
      itemTitle: item.title,
      itemStatus: item.status,
      claimTime: new Date().toLocaleString(),
      userName: 'You', // Can be updated with actual user info later
      userPhone: localStorage.getItem('userPhone') || 'Not provided',
      userEmail: localStorage.getItem('userEmail') || 'Not provided'
    }
    claims.push(newClaim)
    localStorage.setItem('claims', JSON.stringify(claims))
    alert(`✅ You've claimed "${item.title}"! Check your Dashboard to manage this claim.`)
  }

  const handleContactFinder = (item) => {
    alert(`📞 Contact this finder:\n\n${item.contact}`)
  }

  const fetchItems = async () => {
    try {
      setLoading(true)
      setError(null)
      
      let url = '/api/items'
      if (filter !== 'all') {
        url = `/api/items/status/${filter}`
      }
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch items: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      // Transform backend data to match frontend format
      const transformedItems = data.map(item => ({
        id: item.id,
        title: item.title,
        image: item.imageData || 'https://via.placeholder.com/300x300?text=' + encodeURIComponent(item.title),
        location: item.location,
        time: formatTime(item.createdAt),
        status: item.status.toLowerCase(),
        description: item.description,
        contact: item.contactInfo
      }))
      
      setItems(transformedItems)
    } catch (err) {
      console.error('Error fetching items:', err)
      setError(err.message)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Recently'
    
    const date = new Date(timestamp)
    const now = new Date()
    const diff = Math.floor((now - date) / 1000) // seconds
    
    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`
    
    return date.toLocaleDateString()
  }

  const filteredItems = items
  const itemsWithImages = items.filter(item => item.image && !item.image.includes('placeholder'))
  const itemsWithoutImages = items.filter(item => !item.image || item.image.includes('placeholder'))

  const renderItemsGrid = (itemsList, title, showImage = true) => (
    <>
      {itemsList.length > 0 && (
        <>
          <h2 className="section-title">{title}</h2>
          <div className="items-grid">
            {itemsList.map(item => (
              <div key={item.id} className="item-card">
                {showImage && (
                  <div className="item-image-wrapper">
                    <img src={item.image} alt={item.title} className="item-image" />
                    <span className={`item-status ${item.status}`}>
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                )}
                
                {!showImage && (
                  <div className="item-no-image">
                    <span className={`item-status ${item.status}`}>
                      {item.status.toUpperCase()}
                    </span>
                    <div className="no-image-icon">📝</div>
                  </div>
                )}
                
                <div className="item-content">
                  <h3>{item.title}</h3>
                  
                  <div className="item-info">
                    <span className="info-icon">📍</span>
                    <span className="info-text">{item.location}</span>
                  </div>
                  
                  <div className="item-info">
                    <span className="info-icon">🕐</span>
                    <span className="info-text">{item.time}</span>
                  </div>
                  
                  {item.status === 'lost' ? (
                    <button 
                      className="contact-btn"
                      onClick={() => handleContactFinder(item)}
                    >
                      📞 Contact Finder
                    </button>
                  ) : (
                    <button 
                      className="claim-btn"
                      onClick={() => handleClaim(item)}
                    >
                      Claim Item
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )

  return (
    <div className="recent-items-page">
      {/* Header */}
      <div className="recent-header">
        <h1>Recent Trace Activity</h1>
        <p>Browse the latest reports from our community. Every trace brings us one step closer to reuniting people with their precious belongings.</p>
      </div>

      {/* Filters */}
      <div className="items-filter">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Items
        </button>
        <button 
          className={`filter-btn ${filter === 'lost' ? 'active' : ''}`}
          onClick={() => setFilter('lost')}
        >
          Lost
        </button>
        <button 
          className={`filter-btn ${filter === 'found' ? 'active' : ''}`}
          onClick={() => setFilter('found')}
        >
          Found
        </button>
      </div>

      {/* Items Grid */}
      <div className="items-container">
        {loading ? (
          <p className="loading">Loading items...</p>
        ) : error ? (
          <p className="error">Error: {error}</p>
        ) : filteredItems.length > 0 ? (
          <>
            {renderItemsGrid(itemsWithImages, '📸 Items with Photos', true)}
            {renderItemsGrid(itemsWithoutImages, '📝 Items Without Photos (Help Identify!)', false)}
          </>
        ) : (
          <p className="no-items">No items found in this category.</p>
        )}
      </div>

      {/* Load More */}
      <div className="load-more-container">
        <button className="load-more-btn" onClick={fetchItems}>Load More Discoveries</button>
      </div>
    </div>
  )
}

export default RecentItems
