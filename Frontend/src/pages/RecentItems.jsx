import React, { useState, useEffect, useContext } from 'react'
import './styles/recent-items.css'
import ClaimItemModal from '../components/ClaimItemModal'
import itemsAPI from '../services/itemsAPI'
import { AuthContext } from '../context/AuthContext'

const RecentItems = () => {
  const { user } = useContext(AuthContext)
  const [filter, setFilter] = useState('all')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedItemForClaim, setSelectedItemForClaim] = useState(null)
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false)

  useEffect(() => {
    fetchItems()
  }, [filter])

  const handleClaimClick = (item) => {
    setSelectedItemForClaim(item)
    setIsClaimModalOpen(true)
  }

  const handleClaimSuccess = () => {
    // Refresh items after successful claim
    fetchItems()
  }

  const handleContactFinder = (item) => {
    alert(`📞 Contact this finder:\n\n${item.contact}`)
  }

  const fetchItems = async () => {
    try {
      setLoading(true)
      setError(null)
      
      let data
      if (filter === 'all') {
        data = await itemsAPI.getAllItems()
      } else if (filter === 'found') {
        data = await itemsAPI.getItemsByStatus('FOUND')
      } else if (filter === 'lost') {
        data = await itemsAPI.getItemsByStatus('LOST')
      }
      
      // Transform backend data to match frontend format
      const transformedItems = data.map(item => ({
        id: item.id,
        title: item.title,
        imageData: item.imageData,
        location: item.location,
        time: formatTime(item.createdAt),
        status: item.status,
        description: item.description,
        contact: item.contactInfo,
        claimantId: item.claimantId,
        ownerId: item.ownerId
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

  const getActionButton = (item) => {
    const isOwnItem = user && user.id && item.ownerId === user.id
    
    switch (item.status) {
      case 'FOUND':
        return (
          <>
            <button 
              className="claim-btn"
              onClick={() => handleClaimClick(item)}
              disabled={isOwnItem}
              title={isOwnItem ? "You cannot claim your own item" : ""}
            >
              🏷️ Claim Item
            </button>
            {isOwnItem && <p style={{fontSize: '12px', color: '#f57c00', marginTop: '8px'}}>📌 You posted this item</p>}
          </>
        )
      case 'CLAIM_REQUESTED':
        return (
          <button 
            className="claim-btn disabled"
            disabled
          >
            ⏳ Claim Requested
          </button>
        )
      case 'OTP_PENDING':
        return (
          <button 
            className="claim-btn disabled"
            disabled
          >
            🔐 OTP Pending
          </button>
        )
      case 'COMPLETED':
        return (
          <button 
            className="claim-btn completed"
            disabled
          >
            ✅ Claim Completed
          </button>
        )
      case 'LOST':
        return (
          <button 
            className="contact-btn"
            onClick={() => handleContactFinder(item)}
          >
            📞 Contact Finder
          </button>
        )
      default:
        return null
    }
  }

  const filteredItems = items
  const itemsWithImages = items.filter(item => item.imageData)
  const itemsWithoutImages = items.filter(item => !item.imageData)

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
                    <img src={item.imageData} alt={item.title} className="item-image" />
                    <span className={`item-status ${item.status.toLowerCase()}`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>
                )}
                
                {!showImage && (
                  <div className="item-no-image">
                    <span className={`item-status ${item.status.toLowerCase()}`}>
                      {item.status.replace('_', ' ')}
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
                  
                  {getActionButton(item)}
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
        <button className="load-more-btn" onClick={fetchItems}>Refresh Items</button>
      </div>

      {/* Claim Item Modal */}
      {selectedItemForClaim && (
        <ClaimItemModal
          item={selectedItemForClaim}
          isOpen={isClaimModalOpen}
          onClose={() => {
            setIsClaimModalOpen(false)
            setSelectedItemForClaim(null)
          }}
          onSuccess={handleClaimSuccess}
        />
      )}
    </div>
  )
}

export default RecentItems
