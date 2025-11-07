import { useState, useEffect } from 'react'
import api from '../services/api'
import Card from '../components/Card'
import './Dashboard.css'

const Dashboard = () => {
  const [unclaimedEnquiries, setUnclaimedEnquiries] = useState([])
  const [myEnquiries, setMyEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('unclaimed')

  useEffect(() => {
    fetchEnquiries()
    const interval = setInterval(fetchEnquiries, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchEnquiries = async () => {
    try {
      setError('')
      const [unclaimedRes, myRes] = await Promise.all([
        api.get('/api/enquiries/unclaimed'),
        api.get('/api/enquiries/mine')
      ])
      
      setUnclaimedEnquiries(unclaimedRes.data.data)
      setMyEnquiries(myRes.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch enquiries')
    } finally {
      setLoading(false)
    }
  }

  const handleClaim = async (enquiryId) => {
    try {
      setError('')
      await api.post(`/api/enquiries/${enquiryId}/claim`)
      await fetchEnquiries() // Refresh the lists
    } catch (err) {
      if (err.response?.status === 409) {
        setError('This enquiry has already been claimed by another employee')
      } else {
        setError(err.response?.data?.message || 'Failed to claim enquiry')
      }
      setTimeout(() => setError(''), 5000)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Employee Dashboard</h1>
      
      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'unclaimed' ? 'active' : ''}`}
          onClick={() => setActiveTab('unclaimed')}
        >
          <span>Unclaimed Enquiries ({unclaimedEnquiries.length})</span>
        </button>
        <button
          className={`tab ${activeTab === 'mine' ? 'active' : ''}`}
          onClick={() => setActiveTab('mine')}
        >
          <span>My Enquiries ({myEnquiries.length})</span>
        </button>
      </div>

      {activeTab === 'unclaimed' ? (
        <div className="enquiries-section">
          <h2>Unclaimed Enquiries</h2>
          {unclaimedEnquiries.length === 0 ? (
            <Card>
              <p className="empty-message">No unclaimed enquiries at the moment.</p>
            </Card>
          ) : (
            <div className="enquiries-grid">
              {unclaimedEnquiries.map((enquiry) => (
                <Card key={enquiry.id} className="enquiry-card">
                  <div className="enquiry-header">
                    <h3>{enquiry.name}</h3>
                    <span className="enquiry-date">
                      {new Date(enquiry.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="enquiry-details">
                    <p><strong>Email:</strong> {enquiry.email}</p>
                    {enquiry.phone && (
                      <p><strong>Phone:</strong> {enquiry.phone}</p>
                    )}
                    <p><strong>Message:</strong></p>
                    <p className="enquiry-message">{enquiry.message}</p>
                  </div>
                  <button
                    onClick={() => handleClaim(enquiry.id)}
                    className="btn btn-primary btn-block"
                  >
                    Claim Enquiry
                  </button>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="enquiries-section">
          <h2>My Claimed Enquiries</h2>
          {myEnquiries.length === 0 ? (
            <Card>
              <p className="empty-message">You haven't claimed any enquiries yet.</p>
            </Card>
          ) : (
            <div className="enquiries-grid">
              {myEnquiries.map((enquiry) => (
                <Card key={enquiry.id} className="enquiry-card claimed">
                  <div className="enquiry-header">
                    <h3>{enquiry.name}</h3>
                    <span className="badge claimed-badge">Claimed</span>
                  </div>
                  <div className="enquiry-details">
                    <p><strong>Email:</strong> {enquiry.email}</p>
                    {enquiry.phone && (
                      <p><strong>Phone:</strong> {enquiry.phone}</p>
                    )}
                    <p><strong>Message:</strong></p>
                    <p className="enquiry-message">{enquiry.message}</p>
                    <p className="enquiry-date">
                      <strong>Claimed on:</strong>{' '}
                      {new Date(enquiry.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Dashboard

