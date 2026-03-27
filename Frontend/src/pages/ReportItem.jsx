import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import './styles/report.css'

const ReportItem = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    contact: '',
    photos: []
  })
  const [dragActive, setDragActive] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

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

  const validateContact = (contact) => {
    const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)
    const phone = /^[0-9\s+\-()]{7,}$/.test(contact)
    return email || phone
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!form.title.trim()) {
      alert('Please enter an item title')
      return
    }
    
    if (!form.location.trim()) {
      alert('Please enter the location where item was lost')
      return
    }
    
    if (!form.contact.trim()) {
      alert('Please enter your contact information')
      return
    }
    
    if (!validateContact(form.contact.trim())) {
      alert('Please enter a valid email address or phone number')
      return
    }
    
    try {
      const itemData = {
        title: form.title.trim(),
        description: form.description.trim(),
        location: form.location.trim(),
        status: 'LOST',
        reportedDate: form.date ? new Date(form.date).toISOString() : new Date().toISOString(),
        contactInfo: form.contact.trim()
      }
      
      // Only add imageData if a photo was uploaded
      if (form.photos && form.photos.length > 0) {
        itemData.imageData = form.photos[0]
      }
      
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData)
      })
      
      if (!response.ok) {
        let errorMessage = `Failed to submit report: ${response.status} ${response.statusText}`
        try {
          const errorData = await response.json()
          console.error('Server response:', errorData)
          if (errorData.message) {
            errorMessage = errorData.message
          }
        } catch (e) {
          // Response wasn't JSON, already have error message
        }
        throw new Error(errorMessage)
      }
      
      const result = await response.json()
      console.log('Item reported successfully:', result)
      // Navigate after successful submission
      alert('Item reported successfully! Our team will help find it.')
      navigate('/')
    } catch (error) {
      console.error('Error reporting item:', error)
      alert(`Error submitting report: ${error.message}. Please try again.`)
    }
  }

  return (
    <div className="report-container">
      {/* Page Header */}
      <div className="report-header">
        <h1>Report Lost Item</h1>
        <p>Provide as many details as possible. Our Digital Custodian network uses advanced tracing to help reunite you with your belongings.</p>
      </div>

      {/* Main Content */}
      <div className="report-content">
        {/* Left Section - Photo Upload */}
        <div className="report-left">
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
            <p>Detailed photos of unique markings, serial numbers, or scratches significantly increase the chances of a match.</p>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="report-right">
          <form onSubmit={handleSubmit} className="report-form">
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
                placeholder="Describe unique features, contents, or branding..."
                rows={4}
              />
            </div>

            {/* Date Loss & Location */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">DATE LOST</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">LAST SEEN LOCATION</label>
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
              <p className="form-hint">Enter a valid email address or phone number. Only verified finders will be able to see this information.</p>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn-submit">
              Initialize Search Tracking 🔍
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

export default ReportItem
