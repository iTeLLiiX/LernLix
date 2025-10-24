import React, { useState, useEffect } from 'react'
import axios from 'axios'

interface User {
  id: string
  name: string
  email: string
  points: number
  level: number
}

interface Progress {
  id: string
  moduleId: string
  completed: boolean
  score: number
  timeSpent: number
}

export const DashboardPage = () => {
  const [user, setUser] = useState<User | null>(null)
  const [progress, setProgress] = useState<Progress[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        window.location.href = '/login'
        return
      }

      const config = { headers: { Authorization: `Bearer ${token}` } }
      
      const userRes = await axios.get('/api/auth/me', config)
      setUser(userRes.data.user)

      const progressRes = await axios.get('/api/progress', config)
      setProgress(progressRes.data || [])
    } catch (err: any) {
      setError('Failed to load dashboard')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#e0e0e0' }}>Loading...</div>
  }

  if (!user) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#e0e0e0' }}>User not found</div>
  }

  const completedCourses = progress.filter(p => p.completed).length
  const totalCourses = progress.length
  const completionRate = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>👋 Welcome, {user.name}!</h1>
        <p>Keep learning and achieving great things</p>
      </div>

      <div className="dashboard-grid">
        {/* Stats Cards */}
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <div className="stat-number">{user.points}</div>
              <div className="stat-label">Total Points</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <div className="stat-number">Level {user.level}</div>
              <div className="stat-label">Current Level</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-number">{completedCourses}/{totalCourses}</div>
              <div className="stat-label">Courses Completed</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-content">
              <div className="stat-number">{completionRate}%</div>
              <div className="stat-label">Completion Rate</div>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="progress-section">
          <h2>📚 Your Learning Progress</h2>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${completionRate}%` }}></div>
          </div>
          <p className="progress-text">{completionRate}% of courses completed</p>
        </div>

        {/* Recent Courses */}
        <div className="courses-section">
          <h2>🎓 Recent Courses</h2>
          {progress.length > 0 ? (
            <div className="courses-list">
              {progress.slice(0, 5).map(p => (
                <div key={p.id} className="course-item">
                  <div className="course-item-left">
                    <div className={`course-status ${p.completed ? 'completed' : 'in-progress'}`}>
                      {p.completed ? '✅' : '⏳'}
                    </div>
                    <div className="course-info">
                      <h3>Module {p.moduleId.slice(0, 8)}</h3>
                      <p>Score: {p.score}/100 | Time: {Math.round(p.timeSpent / 60)} mins</p>
                    </div>
                  </div>
                  <button className="btn-continue">
                    {p.completed ? 'Review' : 'Continue'}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#888' }}>No courses started yet. Begin your learning journey!</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="actions-section">
          <h2>⚡ Quick Actions</h2>
          <div className="actions-grid">
            <button className="action-btn" onClick={() => window.location.href = '/'}>
              🔍 Explore Courses
            </button>
            <button className="action-btn" onClick={() => {}}>
              📊 View Statistics
            </button>
            <button className="action-btn" onClick={() => {}}>
              🏆 View Achievements
            </button>
            <button className="action-btn" onClick={() => {}}>
              ⚙️ Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
