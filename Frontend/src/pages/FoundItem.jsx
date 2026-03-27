import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import './styles/found.css'

const FoundItem = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    contact: '',
    photos: []
  })
  const [dragActive, setDragActive] = useState(false)
  const [contactError, setContactError] = useState('')
  const navigate = useNavigate()

  const validateContact = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^[0-9\s+\-()]{7,}$/
    if (!emailRegex.test(value) && !phoneRegex.test(value)) {
      return 'Please provide a valid email or phone number'
    }
    return ''
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    if (name === 'contact') {
      setContactError(validateContact(value))
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const files = e.dataTransfer.files
    if (files && files[0]) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setForm({
          ...form,
          photos: [...form.photos, event.target.result].slice(0, 3)
        })
      }
      reader.readAsDataURL(files[0])
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setForm({
          ...form,
          photos: [...form.photos, event.target.result].slice(0, 3)
        })
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate contact field
    const contactValidationError = validateContact(form.contact)
    if (contactValidationError) {
      setContactError(contactValidationError)
      alert(contactValidationError)
      return
    }
    
    try {
      const itemData = {
        title: form.title,
        description: form.description,
        location: form.location,
        status: 'FOUND',
        reportedDate: form.date ? new Date(form.date).toISOString() : new Date().toISOString(),
        contactInfo: form.contact,
        imageData: form.photos[0] || null // Send first photo as base64
      }
      
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData)
      })
      
      if (!response.ok) {
        throw new Error('Failed to post found item')
      }
      
      console.log('Found item posted successfully')
      // Navigate after successful submission
      navigate('/')
    } catch (error) {
      console.error('Error posting found item:', error)
      alert('Error submitting found item. Please try again.')
    }
  }

  return (
    <div className="found-container">
      {/* Page Header */}
      <div className="found-header">
        <h1>Report Found Item</h1>
        <p>Help us reunite this item with its owner. Your integrity matters. Provide clear photos and details to speed up the process.</p>
      </div>

      {/* Main Content */}
      <div className="found-content">
        {/* Left Section - Photo Upload */}
        <div className="found-left">
          <div className="photo-section">
            <label className="photo-label">Item Photos</label>
            
            <div
              className={`upload-area ${dragActive ? 'active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="photo-input"
                className="file-input"
                onChange={handleFileInput}
                accept="image/*"
              />
              <label htmlFor="photo-input" className="upload-label">
                <div className="upload-icon">📷</div>
                <p className="upload-text">Upload a clear photo</p>
                <p className="upload-hint">Drag and drop or click to browse</p>
              </label>
            </div>

            {/* Photo Previews */}
            <div className="photo-previews">
              {form.photos.map((photo, idx) => (
                <div key={idx} className="photo-preview">
                  <img src={photo} alt={`preview-${idx}`} />
                </div>
              ))}
              {[...Array(3 - form.photos.length)].map((_, idx) => (
                <div key={`empty-${idx}`} className="photo-preview empty"></div>
              ))}
            </div>
          </div>

          {/* Custodian Tip */}
          <div className="custodian-tip">
            <div className="tip-icon">💡</div>
            <h3>Custodian Tip</h3>
            <p>Clear, well-lit photos from multiple angles help owners verify they're claiming their genuine items.</p>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="found-right">
          <form onSubmit={handleSubmit} className="found-form">
            {/* Item Title */}
            <div className="form-group">
              <label className="form-label">ITEM TITLE</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g., Blue Leather Wallet"
                required
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">DESCRIPTION</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe colors, brands, condition, or unique features..."
                rows={4}
              />
            </div>

            {/* Date Found & Location */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">DATE FOUND</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">LOCATION FOUND</label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Central Park, NY"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="form-group">
              <label className="form-label">CONTACT INFORMATION</label>
              <input
                type="text"
                name="contact"
                value={form.contact}
                onChange={handleChange}
                placeholder="Email (example@email.com) or Phone (+91-9876543210)"
              />
              {contactError && <p style={{color: '#dc3545', fontSize: '12px', margin: '4px 0 0 0'}}>{contactError}</p>}
              <p className="form-hint">Your info is only shared with verified owners who claim their item.</p>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn-submit">
              Post Found Item 🤝
            </button>
          </form>
        </div>
      </div>

      {/* Live Trace Visualization */}
      <div className="live-trace-section">
        <div className="trace-visualization">
          <span className="trace-badge">🔵 Live Trace Active</span>
        </div>
      </div>
    </div>
  )
}

export default FoundItem
