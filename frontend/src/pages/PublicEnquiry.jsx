import { useState } from 'react'
import Card from '../components/Card'
import FormInput from '../components/FormInput'
import api from '../services/api'
import './PublicEnquiry.css'

const PublicEnquiry = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [error, setError] = useState('')
  const [validationErrors, setValidationErrors] = useState([])
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setValidationErrors([])
    setSuccess(false)
    setLoading(true)

    try {
      await api.post('/api/enquiries/public', formData)
      setSuccess(true)
      setFormData({ name: '', email: '', phone: '', message: '' })
    } catch (err) {
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        // Handle validation errors
        setValidationErrors(err.response.data.errors)
        setError(err.response?.data?.message || 'Please fix the errors below')
      } else {
        setError(err.response?.data?.message || 'Failed to submit enquiry. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="enquiry-container">
        <Card>
          <div className="success-message">
            <h2>✓ Enquiry Submitted Successfully!</h2>
            <p>Thank you for your enquiry. We'll get back to you soon.</p>
            <button onClick={() => setSuccess(false)} className="btn btn-primary">
              Submit Another Enquiry
            </button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="enquiry-container">
      <Card>
        <h2 className="enquiry-title">Submit an Enquiry</h2>
        <p className="enquiry-subtitle">
          Fill out the form below and our team will contact you soon.
        </p>
        
        <form onSubmit={handleSubmit} className="enquiry-form">
          {error && <div className="alert alert-error">{error}</div>}
          {validationErrors.length > 0 && (
            <div className="alert alert-error">
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {validationErrors.map((err, idx) => (
                  <li key={idx}>{err.msg}</li>
                ))}
              </ul>
            </div>
          )}
          
          <FormInput
            label="Full Name *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            minLength={2}
          />
          
          <FormInput
            label="Email *"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          
          <FormInput
            label="Phone (Optional)"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          
          <div className="form-group">
            <label className="form-label">Message *</label>
            <textarea
              className={`form-input ${error ? 'error' : ''}`}
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              minLength={10}
              rows={5}
              placeholder="Please provide details about your enquiry..."
            />
          </div>
          
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Enquiry'}
          </button>
        </form>
      </Card>
    </div>
  )
}

export default PublicEnquiry

