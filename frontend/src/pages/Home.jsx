import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Home.css'

const Home = () => {
  const { user } = useAuth()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const carouselRef = useRef(null)
  const autoplayIntervalRef = useRef(null)

  const features = [
    {
      id: 1,
      icon: '📝',
      title: 'Public Enquiry Form',
      description: 'Customers can easily submit their enquiries without registration. Simple, fast, and user-friendly.',
      link: '/enquiry',
      linkText: 'Submit Enquiry',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      id: 2,
      icon: '👥',
      title: 'Employee Dashboard',
      description: 'Employees can view and claim enquiries to follow up with customers. Stay organized and responsive.',
      link: user ? '/dashboard' : '/login',
      linkText: user ? 'View Dashboard' : 'Login to Access',
      gradient: 'linear-gradient(135deg, #764ba2 0%, #f093fb 100%)'
    },
    {
      id: 3,
      icon: '⚡',
      title: 'Smart Claim System',
      description: 'Atomic enquiry claiming prevents conflicts between employees. No duplicates, no confusion.',
      link: '#',
      linkText: 'Learn More',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      id: 4,
      icon: '🔒',
      title: 'Secure Authentication',
      description: 'JWT-based security with bcrypt password hashing. Your data is protected with industry-standard encryption.',
      link: '#',
      linkText: 'Secure Platform',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      id: 5,
      icon: '📊',
      title: 'Real-time Updates',
      description: 'Automatic refresh every 30 seconds keeps your dashboard updated with the latest enquiries instantly.',
      link: '#',
      linkText: 'Live Updates',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
    {
      id: 6,
      icon: '🚀',
      title: 'Fast & Responsive',
      description: 'Lightning-fast performance with modern React architecture. Works seamlessly on all devices.',
      link: '#',
      linkText: 'High Performance',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    },
    {
      id: 7,
      icon: '📱',
      title: 'Mobile Friendly',
      description: 'Fully responsive design that works perfectly on desktop, tablet, and mobile devices.',
      link: '#',
      linkText: 'Responsive Design',
      gradient: 'linear-gradient(135deg, #fee140 0%, #fa709a 100%)'
    },
    {
      id: 8,
      icon: '💼',
      title: 'Team Collaboration',
      description: 'Multiple employees can work together efficiently with our atomic claim system preventing conflicts.',
      link: '#',
      linkText: 'Collaborate',
      gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
    }
  ]

  const getItemsPerView = () => {
    if (typeof window === 'undefined') return 3
    if (window.innerWidth >= 1200) return 3
    if (window.innerWidth >= 768) return 2
    return 1
  }

  const [itemsVisible, setItemsVisible] = useState(getItemsPerView())
  const maxIndex = Math.max(0, features.length - itemsVisible)

  useEffect(() => {
    const handleResize = () => {
      setItemsVisible(getItemsPerView())
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(Math.max(0, maxIndex))
    }
  }, [maxIndex, currentIndex])

  useEffect(() => {
    if (isAutoPlaying && maxIndex > 0) {
      autoplayIntervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
      }, 5000)
    } else {
      if (autoplayIntervalRef.current) {
        clearInterval(autoplayIntervalRef.current)
      }
    }

    return () => {
      if (autoplayIntervalRef.current) {
        clearInterval(autoplayIntervalRef.current)
      }
    }
  }, [isAutoPlaying, maxIndex])

  const pauseAutoPlay = () => {
    setIsAutoPlaying(false)
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current)
    }
  }

  const resumeAutoPlay = () => {
    setIsAutoPlaying(true)
  }

  const handlePrev = () => {
    pauseAutoPlay()
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
    setTimeout(resumeAutoPlay, 6000)
  }

  const handleNext = () => {
    pauseAutoPlay()
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
    setTimeout(resumeAutoPlay, 6000)
  }

  const goToSlide = (index) => {
    pauseAutoPlay()
    setCurrentIndex(index)
    setTimeout(resumeAutoPlay, 6000)
  }

  return (
    <div className="home">
      {/* Animated Background Elements */}
      <div className="bg-animation">
        <div className="zigzag-lines"></div>
        <div className="zigzag-lines zigzag-lines-2"></div>
        <div className="zigzag-lines zigzag-lines-3"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
        </div>
        <div className="particles">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="particle" 
              style={{
                '--delay': `${i * 0.2}s`,
                left: `${(i * 5) % 100}%`,
                animationDelay: `${i * 0.2}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="hero">
        <div className="hero-content">
          <div className="hero-badge">🚀 Modern CRM Solution</div>
          <h1 className="hero-title">
            <span className="title-line">Transform Your</span>
            <span className="title-line gradient-text">Customer Relations</span>
          </h1>
          <p className="hero-subtitle">
            Streamline enquiries, boost productivity, and deliver exceptional customer experiences
            with our powerful CRM platform designed for modern teams.
          </p>
          <div className="hero-actions">
            {!user ? (
              <>
                <Link to="/login" className="btn btn-primary btn-hero">
                  <span>Employee Login</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <Link to="/enquiry" className="btn btn-secondary btn-hero">
                  <span>Submit Enquiry</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 3V17M3 10H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </Link>
              </>
            ) : (
              <Link to="/dashboard" className="btn btn-primary btn-hero">
                <span>Go to Dashboard</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            )}
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Secure</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Available</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">Fast</div>
              <div className="stat-label">Response</div>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-card card-1">
            <div className="card-icon">📊</div>
            <div className="card-text">Analytics</div>
          </div>
          <div className="visual-card card-2">
            <div className="card-icon">⚡</div>
            <div className="card-text">Speed</div>
          </div>
          <div className="visual-card card-3">
            <div className="card-icon">🔒</div>
            <div className="card-text">Security</div>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="section-header">
          <h2 className="section-title">Why Choose Our CRM?</h2>
          <p className="section-subtitle">Everything you need to manage customer relationships effectively</p>
        </div>
        
        <div className="carousel-wrapper">
          <button 
            className="carousel-nav carousel-prev"
            onClick={handlePrev}
            onMouseEnter={pauseAutoPlay}
            onMouseLeave={resumeAutoPlay}
            disabled={currentIndex === 0 || maxIndex === 0}
            aria-label="Previous slide"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button 
            className="carousel-nav carousel-next"
            onClick={handleNext}
            onMouseEnter={pauseAutoPlay}
            onMouseLeave={resumeAutoPlay}
            disabled={currentIndex >= maxIndex || maxIndex === 0}
            aria-label="Next slide"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className="carousel-viewport" ref={carouselRef}>
            <div 
              className="carousel-slider"
              style={{
                '--items-visible': itemsVisible,
                '--current-index': currentIndex,
                transform: itemsVisible > 1 
                  ? `translateX(calc(-${currentIndex * (100 / itemsVisible)}% - ${currentIndex * (2 / itemsVisible)}rem))`
                  : `translateX(-${currentIndex * 100}%)`
              }}
              onMouseEnter={pauseAutoPlay}
              onMouseLeave={resumeAutoPlay}
            >
              {features.map((feature, index) => {
                const CardComponent = feature.link === '#' ? 'div' : Link
                const cardProps = feature.link === '#' ? {} : { to: feature.link }
                
                return (
                  <CardComponent
                    key={feature.id}
                    {...cardProps}
                    className="feature-card-carousel"
                    style={{ '--gradient': feature.gradient }}
                  >
                    <div className="feature-card-bg" style={{ background: feature.gradient }}></div>
                    <div className="feature-card-content">
                      <div className="feature-icon-carousel">{feature.icon}</div>
                      <h3>{feature.title}</h3>
                      <p>{feature.description}</p>
                      <div className="feature-action">
                        <span>{feature.linkText}</span>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </CardComponent>
                )
              })}
            </div>
          </div>

          <div className="carousel-pagination">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                className={`carousel-dot ${currentIndex === idx ? 'active' : ''}`}
                onClick={() => goToSlide(idx)}
                onMouseEnter={pauseAutoPlay}
                onMouseLeave={resumeAutoPlay}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer Section with Background Color */}
      <div className="footer-section">
        <div className="footer-content">
          <div className="footer-text">
            <h3>Ready to Transform Your Customer Relations?</h3>
            <p>Join thousands of teams already using our CRM platform</p>
          </div>
          <div className="footer-actions">
            {!user ? (
              <Link to="/login" className="btn btn-primary">
                Get Started Now
              </Link>
            ) : (
              <Link to="/dashboard" className="btn btn-primary">
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
