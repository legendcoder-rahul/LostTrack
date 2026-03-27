import React, { useState, useEffect } from 'react'
import '../components/styles/claims-board.css'
import itemsAPI from '../services/itemsAPI.js'

const ClaimsBoard = () => {
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [processingId, setProcessingId] = useState(null)

  useEffect(() => {
    fetchClaimRequests()
    // Refresh every 10 seconds
    const interval = setInterval(fetchClaimRequests, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchClaimRequests = async () => {
    try {
      setError(null)
      const response = await itemsAPI.getMyClaimRequests()
      setClaims(response || [])
    } catch (err) {
      console.error('Error fetching claim requests:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (itemId) => {
    try {
      setProcessingId(itemId)
      await itemsAPI.approveClaim(itemId)
      alert('✅ Claim approved!\n\nAn OTP has been generated and sent to you. Share this OTP with the claimant during your meetup.')
      fetchClaimRequests()
    } catch (err) {
      alert(`❌ Error: ${err.message}`)
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (itemId) => {
    if (!window.confirm('Are you sure you want to reject this claim? The item will be available for other users to claim.')) {
      return
    }

    try {
      setProcessingId(itemId)
      await itemsAPI.rejectClaim(itemId)
      alert('✅ Claim rejected.\n\nThe item is now available for other users to claim.')
      fetchClaimRequests()
    } catch (err) {
      alert(`❌ Error: ${err.message}`)
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) {
    return (
      <div className="claims-board">
        <div className="loading">Loading claim requests...</div>
      </div>
    )
  }

  return (
    <div className="claims-board">
      <div className="claims-header">
        <h2>📋 Claim Requests</h2>
        <p>Review and respond to items being claimed</p>
      </div>

      {error && (
        <div className="error-banner">
          <p>⚠️ {error}</p>
        </div>
      )}

      {claims.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No Pending Claims</h3>
          <p>You don't have any pending claim requests at the moment.</p>
        </div>
      ) : (
        <div className="claims-list">
          {claims.map((item) => (
            <div key={item.id} className="claim-card">
              <div className="claim-card-left">
                {item.imageData ? (
                  <img 
                    src={item.imageData}
                    alt={item.title}
                    className="claim-item-image"
                  />
                ) : (
                  <div className="claim-item-placeholder">📦</div>
                )}
              </div>

              <div className="claim-card-content">
                <h3>{item.title}</h3>
                <div className="claim-details">
                  <div className="detail-item">
                    <span className="detail-label">📍 Location:</span>
                    <span className="detail-value">{item.location}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">📝 Status:</span>
                    <span className={`status-badge ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">📢 Description:</span>
                    <p className="detail-description">{item.description || 'No description provided'}</p>
                  </div>
                </div>

                {item.status === 'CLAIM_REQUESTED' && (
                  <div className="claim-actions">
                    <button
                      className="btn btn-approve"
                      onClick={() => handleApprove(item.id)}
                      disabled={processingId === item.id}
                    >
                      {processingId === item.id ? '⏳ Processing...' : '✅ Approve'}
                    </button>
                    <button
                      className="btn btn-reject"
                      onClick={() => handleReject(item.id)}
                      disabled={processingId === item.id}
                    >
                      {processingId === item.id ? '⏳ Processing...' : '❌ Reject'}
                    </button>
                  </div>
                )}

                {item.status === 'OTP_PENDING' && (
                  <div className="claim-status-info">
                    <span className="status-message">
                      ⏱️ Waiting for claimant to verify OTP...
                    </span>
                    {item.claimApprovedDate && (
                      <span className="approved-time">
                        Approved: {new Date(item.claimApprovedDate).toLocaleString()}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ClaimsBoard
