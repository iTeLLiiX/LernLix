import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import './main.css'

interface Module {
  id: string
  title: string
  category: string
  description: string
  difficulty: string
  duration: number
}

function App() {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    fetchModules()
  }, [])

  const fetchModules = async () => {
    try {
      const response = await fetch('http://45.133.9.167:3001/api/modules')
      const data = await response.json()
      setModules(data || [])
    } catch (error) {
      console.error('Error fetching modules:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['all', 'c#', 'networking', 'security']
  const filteredModules = selectedCategory === 'all' 
    ? modules 
    : modules.filter(m => m.category.toLowerCase() === selectedCategory)

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo">
            <span className="logo-icon">📚</span>
            <span className="logo-text">LernLix</span>
          </div>
          <ul className="nav-menu">
            <li><a href="#" className="nav-link active">Home</a></li>
            <li><a href="#" className="nav-link">Courses</a></li>
            <li><a href="#" className="nav-link">About</a></li>
            <li><a href="#" className="nav-link">Contact</a></li>
          </ul>
          <button className="login-btn">Login</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Learn <span className="gradient-text">Professional Skills</span> Online
          </h1>
          <p className="hero-subtitle">
            Master C# programming, network technology, and more with interactive courses
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary">Start Learning</button>
            <button className="btn btn-secondary">Explore Courses</button>
          </div>
        </div>
        <div className="hero-background">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stat-item">
          <div className="stat-number">2000+</div>
          <div className="stat-label">Active Students</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">50+</div>
          <div className="stat-label">Expert Courses</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">95%</div>
          <div className="stat-label">Success Rate</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">24/7</div>
          <div className="stat-label">Support</div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="courses-section">
        <h2 className="section-title">Explore Our Courses</h2>
        <div className="category-filter">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        <div className="courses-grid">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading courses...</p>
            </div>
          ) : filteredModules.length > 0 ? (
            filteredModules.map(module => (
              <div key={module.id} className="course-card">
                <div className="course-header">
                  <div className={`difficulty-badge ${module.difficulty}`}>
                    {module.difficulty.toUpperCase()}
                  </div>
                  <div className="course-icon">📖</div>
                </div>
                <h3 className="course-title">{module.title}</h3>
                <p className="course-description">{module.description}</p>
                <div className="course-meta">
                  <span className="course-duration">⏱️ {module.duration} min</span>
                  <span className="course-category">{module.category}</span>
                </div>
                <button className="course-btn">Start Course →</button>
              </div>
            ))
          ) : (
            <div className="no-courses">
              <p>No courses found in this category</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="section-title">Why Choose LernLix?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Goal-Oriented</h3>
            <p>Structured courses designed to help you achieve your learning goals</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👨‍🏫</div>
            <h3>Expert Instructors</h3>
            <p>Learn from industry professionals with years of experience</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3>Certifications</h3>
            <p>Earn recognized certificates upon course completion</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Learn Anywhere</h3>
            <p>Access courses on any device, anytime, anywhere</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>LernLix</h4>
            <p>Your platform for professional learning and development</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Courses</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Connect</h4>
            <ul>
              <li><a href="#">Twitter</a></li>
              <li><a href="#">LinkedIn</a></li>
              <li><a href="#">GitHub</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 LernLix. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
