import React, { useState } from 'react'
import { Link } from 'react-router'
import './styles/contact.css'

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' })
  const [expandedFaq, setExpandedFaq] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Contact form submitted:', form)
    setForm({ name: '', email: '', subject: 'General Inquiry', message: '' })
  }

  const faqs = [
    {
      question: 'How long are found items kept in the system?',
      answer: 'Found items are typically stored for 30 days unless the owner claims them earlier. After 30 days, items may be donated or disposed of according to local regulations. We recommend reporting lost items as soon as possible to increase the chance of recovery.'
    },
    {
      question: 'Is there a fee for reporting a lost item?',
      answer: 'No, reporting a lost item is completely free. FoundTrack is committed to helping people reunite with their belongings without any charges. Premium features may be available for businesses and venues.'
    },
    {
      question: 'How do I verify I\'m the owner of a found item?',
      answer: 'We use a multi-step verification process including serial numbers, distinctive marks, photos, and descriptions. Once a match is found, we require confirmation from both parties before facilitating the return.'
    },
    {
      question: 'Does FoundTrack handle international shipping?',
      answer: 'Yes, we help coordinate international item returns through our partner shipping services. Shipping costs are negotiated directly between the parties involved in the transaction.'
    },
  ]

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <h1>How can we <span className="highlight">help?</span></h1>
        <p className="hero-subtitle">
          Whether you've lost a precious item or found someone's property, our team is here<br />
          to support you in the recovery process.
        </p>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="contact-container">
          {/* Contact Form */}
          <div className="contact-form-wrapper">
            <h2>Send us a message</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Subject</label>
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option>General Inquiry</option>
                  <option>Report a Lost Item</option>
                  <option>Report a Found Item</option>
                  <option>Match Verification</option>
                  <option>Shipping Issue</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea
                  name="message"
                  placeholder="Tell us more about your inquiry..."
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  required
                />
              </div>

              <button type="submit" className="btn-submit">Send Message</button>
            </form>
          </div>

          {/* Direct Support & Map */}
          <div className="contact-sidebar">
            {/* Direct Support */}
            <div className="direct-support">
              <h3>
                <span className="support-icon">📞</span> Direct Support
              </h3>
              <div className="support-item">
                <div className="support-icon-box email">📧</div>
                <div>
                  <div className="support-label">EMAIL US</div>
                  <a href="mailto:support@foundtrack.com" className="support-link">support@foundtrack.com</a>
                </div>
              </div>
              <div className="support-item">
                <div className="support-icon-box phone">📱</div>
                <div>
                  <div className="support-label">CALL US</div>
                  <a href="tel:+15551234567" className="support-link">+1 (555) 123-4567</a>
                </div>
              </div>
              <div className="support-item">
                <div className="support-icon-box location">📍</div>
                <div>
                  <div className="support-label">VISIT US</div>
                  <div className="support-link">123 Logistics Way<br />Innovation District, SF 94103</div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="map-container">
              <div className="map-placeholder">
                <img src="https://via.placeholder.com/300x200" alt="FoundTrack Location" />
              </div>
              <a href="#" className="btn-map">🗺️ Open in Google Maps</a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="faq-container">
          <h2>Frequently Asked Questions</h2>
          <p className="faq-subtitle">Quick answers to common questions about our system.</p>

          <div className="faq-list">
            {faqs.map((faq, idx) => (
              <div key={idx} className="faq-item">
                <button
                  className="faq-question"
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                >
                  <span>{faq.question}</span>
                  <span className={`faq-icon ${expandedFaq === idx ? 'open' : ''}`}>
                    ▼
                  </span>
                </button>
                {expandedFaq === idx && (
                  <div className="faq-answer">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
