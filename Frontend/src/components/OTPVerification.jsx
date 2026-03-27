import React, { useState, useEffect } from 'react'
import '../styles/otp-verification.css'
import itemsAPI from '../../services/itemsAPI'

const OTPVerification = ({ item, isOpen, onClose, onSuccess }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [remainingAttempts, setRemainingAttempts] = useState(3)
  const [timeLeft, setTimeLeft] = useState(null)

  // Calculate remaining time
  useEffect(() => {
    if (!item?.otpExpiry) return

    const interval = setInterval(() => {
      const expiry = new Date(item.otpExpiry)
      const now = new Date()
      const diff = Math.floor((expiry - now) / 1000)

      if (diff <= 0) {
        setTimeLeft('Expired')
        setError('OTP has expired. Please request a new one.')
      } else {
        const minutes = Math.floor(diff / 60)
        const seconds = diff % 60
        setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [item?.otpExpiry])

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return // Only allow numbers

    const newOtp = [...otp]
    newOtp[index] = value.slice(0, 1) // Only single digit

    setOtp(newOtp)

    // Auto-focus to next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  const handleVerifyOTP = async () => {
    const otpString = otp.join('')

    if (otpString.length !== 6) {
      setError('Please enter all 6 digits')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await itemsAPI.verifyOTP(item.id, otpString)

      alert('✅ OTP verified successfully!\n\nYour claim has been completed. The item has been marked as returned.')
      onSuccess()
      onClose()
    } catch (err) {
      const errorMessage = err.message || 'Failed to verify OTP'
      
      // Extract attempt count from error message if available
      if (errorMessage.includes('Remaining attempts')) {
        const match = errorMessage.match(/Remaining attempts: (\d+)/)
        if (match) {
          setRemainingAttempts(parseInt(match[1]))
        }
      }

      setError(errorMessage)
      setOtp(['', '', '', '', '', ''])
      
      // Refocus on first input
      document.getElementById('otp-0')?.focus()
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content otp-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Enter OTP</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <div className="otp-info">
            <h3>Item: {item.title}</h3>
            <p className="otp-description">The item owner has approved your claim and sent you an OTP. Enter the 6-digit code below to complete the process.</p>
          </div>

          <div className="otp-timer">
            <span className={`timer-label ${timeLeft === 'Expired' ? 'expired' : ''}`}>
              Time remaining: {timeLeft || 'Loading...'}
            </span>
          </div>

          <div className="otp-input-container">
            <div className="otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="otp-input"
                  disabled={loading}
                  autoFocus={index === 0}
                />
              ))}
            </div>
          </div>

          <div className="otp-attempts">
            <p>Remaining attempts: <span className={remainingAttempts <= 1 ? 'critical' : ''}>{remainingAttempts}</span></p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="otp-notes">
            <h4>Instructions:</h4>
            <ul>
              <li>Ask the item owner for the OTP during your meetup</li>
              <li>Enter all 6 digits correctly</li>
              <li>OTP is valid for 5 minutes after approval</li>
              <li>You have up to 3 attempts</li>
            </ul>
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
            onClick={handleVerifyOTP}
            disabled={loading || otp.some(d => !d)}
          >
            {loading ? 'Verifying...' : 'Submit OTP'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default OTPVerification
