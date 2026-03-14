import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import './styles/found.css'

const FoundItem = () => {
  const [form, setForm] = useState({ title: '', description: '', date: '', location: '', contact: '' })
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Found item submitted:', form)
    // TODO: send to backend
    navigate('/')
  }

  return (
    <div className="page-container">
      <h2>Report Found Item</h2>
      <form onSubmit={handleSubmit} className="item-form">
        <label>Title</label>
        <input name="title" value={form.title} onChange={handleChange} required />

        <label>Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} rows={4} />

        <label>Date</label>
        <input type="date" name="date" value={form.date} onChange={handleChange} />

        <label>Location</label>
        <input name="location" value={form.location} onChange={handleChange} />

        <label>Contact</label>
        <input name="contact" value={form.contact} onChange={handleChange} />

        <button type="submit" className="btn submit">Submit</button>
      </form>
    </div>
  )
}

export default FoundItem
