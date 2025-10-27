import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import './main.css'
import './auth.css'
import './dashboard.css'
import RPGDashboard from './pages/RPGDashboard'
import ModulesPage from './pages/ModulesPage'

const API_URL = process.env.VITE_API_URL || '/api'

// Auth Context
const AuthContext = React.createContext<any>(null)

function AuthProvider({ children }: any) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      fetchUser(token)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        setUser(await response.json())
      } else {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await response.json()
    if (response.ok) {
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      setUser(data.user)
      return true
    }
    throw new Error(data.error || 'Login failed')
  }

  const register = async (fullName: string, email: string, password: string, confirmPassword: string) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password, confirmPassword })
    })
    const data = await response.json()
    if (response.ok) {
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      setUser(data.user)
      return true
    }
    throw new Error(data.error || 'Registration failed')
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  return React.useContext(AuthContext)
}

// Landing Page
function LandingPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="landing">
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">CodeSnap</span>
          </div>
          <ul className="nav-menu">
            <li><a href="#features" className="nav-link">Features</a></li>
            <li><a href="#about" className="nav-link">About</a></li>
            <li><a href="#contact" className="nav-link">Contact</a></li>
          </ul>
          <div className="nav-buttons">
            {user ? (
              <>
                <span className="user-name">👋 {user.fullName}</span>
                <button className="btn btn-secondary" onClick={() => { localStorage.clear(); window.location.href = '/' }}>Logout</button>
              </>
            ) : (
              <>
                <button className="btn btn-secondary" onClick={() => navigate('/login')}>Login</button>
                <button className="btn btn-primary" onClick={() => navigate('/register')}>Sign Up</button>
              </>
            )}
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Learn <span className="gradient-text">Code Smarter</span> with CodeSnap</h1>
          <p className="hero-subtitle">Master programming through interactive quizzes, challenges, and gamified learning. Perfect for beginners and experts.</p>
          <div className="hero-buttons">
            <button className="btn btn-primary btn-lg" onClick={() => navigate(user ? '/dashboard' : '/register')}>
              {user ? 'Go to Dashboard' : 'Start Learning Free'}
            </button>
            <button className="btn btn-secondary btn-lg">Explore Courses</button>
          </div>
        </div>
        <div className="hero-background">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
        </div>
      </section>

      <section className="stats">
        <div className="stat-item">
          <div className="stat-number">50K+</div>
          <div className="stat-label">Active Learners</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">1000+</div>
          <div className="stat-label">Quiz Questions</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">98%</div>
          <div className="stat-label">Success Rate</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">24/7</div>
          <div className="stat-label">Support</div>
        </div>
      </section>

      <section id="features" className="features">
        <h2 className="section-title">Why Choose CodeSnap?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Lightning Fast</h3>
            <p>Learn at your own pace with interactive, bite-sized lessons</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎮</div>
            <h3>Gamified Learning</h3>
            <p>Earn badges, points, and compete with the community</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3>Certificates</h3>
            <p>Get recognized certifications upon course completion</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Multi-Platform</h3>
            <p>Learn on desktop, tablet, or mobile anytime, anywhere</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>CodeSnap</h4>
            <p>The modern platform for learning to code</p>
          </div>
          <div className="footer-section">
            <h4>Resources</h4>
            <ul>
              <li><a href="#">Courses</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Community</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Terms</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 CodeSnap. All rights reserved. ⚡</p>
        </div>
      </footer>
    </div>
  )
}

// Login Page
function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <span className="auth-icon">⚡</span>
          <h1>CodeSnap</h1>
          <p>Welcome back!</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Don't have an account? <a href="/register">Sign up</a></p>
        </div>
      </div>
    </div>
  )
}

// Register Page
function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await register(fullName, email, password, confirmPassword)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <span className="auth-icon">⚡</span>
          <h1>CodeSnap</h1>
          <p>Join the learning revolution</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up Free'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Already have an account? <a href="/login">Login</a></p>
        </div>
      </div>
    </div>
  )
}

// Dashboard Page
function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    return <Navigate to="/login" />
  }

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <div className="nav-brand">⚡ CodeSnap</div>
        <div className="nav-user">
          <span>{user.fullName}</span>
          <button onClick={() => { logout(); navigate('/'); }} className="logout-btn">Logout</button>
        </div>
      </nav>
      
      <div className="dashboard-content">
        <h1>Welcome, {user.fullName}! 🎉</h1>
        <button 
          onClick={() => navigate('/rpg-dashboard')}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            marginBottom: '2rem'
          }}
        >
          🎮 Enter RPG Dashboard →
        </button>
        <div className="dashboard-grid">
          <div className="card">
            <h3>Your Progress</h3>
            <p className="big-number">0%</p>
            <p className="card-subtitle">Keep learning!</p>
          </div>
          <div className="card">
            <h3>Courses</h3>
            <p className="big-number">0</p>
            <p className="card-subtitle">Completed courses</p>
          </div>
          <div className="card">
            <h3>Points</h3>
            <p className="big-number">0</p>
            <p className="card-subtitle">Total points earned</p>
          </div>
          <div className="card">
            <h3>Streak</h3>
            <p className="big-number">0</p>
            <p className="card-subtitle">Days in a row</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Protected Route
function ProtectedRoute({ element }: any) {
  const { user, loading } = useAuth()
  
  if (loading) return <div className="loading">Loading...</div>
  return user ? element : <Navigate to="/login" />
}

// Main App
function App() {
  const { loading } = useAuth()
  
  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<ProtectedRoute element={<DashboardPage />} />} />
      <Route path="/rpg-dashboard" element={<ProtectedRoute element={<RPGDashboard />} />} />
      <Route path="/modules" element={<ProtectedRoute element={<ModulesPage />} />} />
    </Routes>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <App />
      </Router>
    </AuthProvider>
  </React.StrictMode>,
)
