import React, { useState } from 'react'
import '../components/styles/claim-modal.css'
import itemsAPI from '../services/itemsAPI.js'

const ClaimItemModal = ({ item, isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [confirmChecked, setConfirmChecked] = useState(false)

  const handleClaim = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await itemsAPI.claimItem(item.id)

      // Handle success
      alert(`✅ Claim requested for "${item.title}"!\n\nThe item owner will review your request and contact you with an OTP if approved.`)
      onSuccess()
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to claim item')
      console.error('Error claiming item:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content claim-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Claim Item</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <div className="item-preview">
            <img 
              src={item.imageData || 'https://via.placeholder.com/200x200?text=' + encodeURIComponent(item.title)} 
              alt={item.title}
              className="preview-image"
            />
            <div className="item-details">
              <h3>{item.title}</h3>
              <p className="item-location">📍 {item.location}</p>
              <p className="item-status">Status: <span className="status-badge">{item.status}</span></p>
            </div>
          </div>

          <div className="claim-info">
            <h4>About This Claim Process:</h4>
            <ul>
              <li>A request will be sent to the item owner</li>
              <li>The owner will review your claim and contact you</li>
              <li>If approved, you'll receive an OTP</li>
              <li>Share proof of ownership during meetup</li>
              <li>Enter OTP to complete the claim</li>
            </ul>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="claim-confirmation">
            <p>By clicking "Confirm Claim", you confirm that this is your item and you have the original proof of ownership.</p>
            <div className="confirmation-checkbox">
              <input 
                type="checkbox" 
                id="confirm-claim"
                checked={confirmChecked}
                onChange={(e) => setConfirmChecked(e.target.checked)}
                required
              />
              <label htmlFor="confirm-claim">I confirm this is my item and I have proof of ownership</label>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button 
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleClaim}
            disabled={loading || !confirmChecked}
          >
            {loading ? 'Claiming...' : 'Confirm Claim'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ClaimItemModal
