import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ModulesPage() {
  const navigate = useNavigate()
  const [modules, setModules] = useState<any[]>([])
  const [userProgress, setUserProgress] = useState<any>({})
  const [selectedModule, setSelectedModule] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)

  const API_URL = process.env.VITE_API_URL || '/api'

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      const token = localStorage.getItem('accessToken')

      // Fetch Modules
      const modulesRes = await fetch(`${API_URL}/modules`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const modulesData = await modulesRes.json()
      setModules(modulesData.data || [])

      // Fetch User Progress
      const progressRes = await fetch(`${API_URL}/modules/user/progress`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const progressData = await progressRes.json()
      
      const progressMap: any = {}
      progressData.data?.forEach((p: any) => {
        progressMap[p.moduleId] = p
      })
      setUserProgress(progressMap)

      // Fetch User Stats
      const statsRes = await fetch(`${API_URL}/stats/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const statsData = await statsRes.json()
      setStats(statsData.stats)

      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }

  const startModule = async (moduleId: string) => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch(`${API_URL}/modules/${moduleId}/start`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      
      if (response.ok) {
        setUserProgress({
          ...userProgress,
          [moduleId]: data.data
        })
      }
    } catch (error) {
      console.error('Error starting module:', error)
    }
  }

  const completeModule = async (moduleId: string) => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch(`${API_URL}/modules/${moduleId}/complete`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      
      if (response.ok) {
        alert(`🎉 Module completed! +${data.rewards.xp} XP, +${data.rewards.coins} Coins\n\nCertificate: ${data.certificateNumber}`)
        fetchAllData()
      } else {
        alert(`❌ ${data.error}`)
      }
    } catch (error) {
      console.error('Error completing module:', error)
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #111827 0%, #1a1a2e 100%)',
        color: '#e5e7eb'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
          <p>Loading modules...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #111827 0%, #1a1a2e 100%)',
      color: '#e5e7eb',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          padding: '1.5rem',
          background: 'rgba(139, 92, 246, 0.1)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)'
        }}>
          <div>
            <h1 style={{ fontSize: '2rem', margin: 0 }}>📚 Learning Modules</h1>
            <p style={{ margin: '0.5rem 0 0 0', color: '#aaa' }}>Level {stats?.level || 1} Learner</p>
          </div>
          <button
            onClick={() => navigate('/rpg-dashboard')}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
              border: 'none',
              color: 'white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}
          >
            Back to Dashboard
          </button>
        </div>

        {/* Modules Grid */}
        {!selectedModule ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '1.5rem'
          }}>
            {modules.map((module: any) => {
              const progress = userProgress[module.id]
              const isCompleted = progress?.status === 'completed'
              const isStarted = progress?.status === 'in_progress'

              return (
                <div
                  key={module.id}
                  onClick={() => setSelectedModule(module)}
                  style={{
                    padding: '1.5rem',
                    background: 'rgba(139, 92, 246, 0.05)',
                    border: `1px solid rgba(139, 92, 246, 0.2)`,
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    opacity: isCompleted ? 0.8 : 1
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(139, 92, 246, 0.1)'
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(139, 92, 246, 0.4)'
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(139, 92, 246, 0.05)'
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(139, 92, 246, 0.2)'
                  }}
                >
                  {/* Module Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{module.title}</h3>
                      <p style={{ margin: '0.5rem 0 0 0', color: '#aaa', fontSize: '0.9rem' }}>
                        {module.category} • {module.duration} min
                      </p>
                    </div>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      background: module.difficulty === 'advanced' ? 'rgba(239, 68, 68, 0.2)' : module.difficulty === 'intermediate' ? 'rgba(251, 146, 60, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                      color: module.difficulty === 'advanced' ? '#fca5a5' : module.difficulty === 'intermediate' ? '#fed7aa' : '#86efac',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {module.difficulty}
                    </span>
                  </div>

                  {/* Description */}
                  <p style={{ margin: '0.5rem 0 1rem 0', color: '#aaa', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    {module.description}
                  </p>

                  {/* Lessons & Challenges */}
                  <div style={{ display: 'flex', gap: '1rem', margin: '1rem 0', fontSize: '0.85rem', color: '#aaa' }}>
                    <span>📖 {module.lessons?.length || 0} Lessons</span>
                    <span>🎯 {module.challenges?.length || 0} Challenges</span>
                  </div>

                  {/* Rewards */}
                  <div style={{ display: 'flex', gap: '1rem', margin: '1rem 0', fontSize: '0.9rem' }}>
                    <span>⭐ +{module.xpReward} XP</span>
                    <span>🪙 +{module.coinReward} Coins</span>
                  </div>

                  {/* Status */}
                  {isCompleted ? (
                    <div style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(34, 197, 94, 0.2)',
                      border: '1px solid rgba(34, 197, 94, 0.5)',
                      color: '#86efac',
                      borderRadius: '6px',
                      textAlign: 'center',
                      fontWeight: '600',
                      fontSize: '0.9rem'
                    }}>
                      ✅ Completed
                    </div>
                  ) : isStarted ? (
                    <div style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(251, 146, 60, 0.2)',
                      border: '1px solid rgba(251, 146, 60, 0.5)',
                      color: '#fed7aa',
                      borderRadius: '6px',
                      textAlign: 'center',
                      fontWeight: '600',
                      fontSize: '0.9rem'
                    }}>
                      ⏳ In Progress
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        startModule(module.id)
                      }}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                        border: 'none',
                        color: 'white',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)'
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.transform = 'scale(1)'
                      }}
                    >
                      Start Module
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          /* Module Details */
          <div style={{
            padding: '2rem',
            background: 'rgba(139, 92, 246, 0.05)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '10px'
          }}>
            <button
              onClick={() => setSelectedModule(null)}
              style={{
                marginBottom: '1.5rem',
                padding: '0.5rem 1rem',
                background: 'rgba(139, 92, 246, 0.2)',
                border: '1px solid rgba(139, 92, 246, 0.5)',
                color: '#8B5CF6',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}
            >
              ← Back to Modules
            </button>

            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{selectedModule.title}</h2>
            <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>{selectedModule.description}</p>

            {/* Lessons */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>📖 Lessons ({selectedModule.lessons?.length || 0})</h3>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {selectedModule.lessons?.map((lesson: any, idx: number) => (
                  <div
                    key={idx}
                    style={{
                      padding: '1rem',
                      background: 'rgba(139, 92, 246, 0.1)',
                      border: '1px solid rgba(139, 92, 246, 0.2)',
                      borderRadius: '6px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span>{lesson.title}</span>
                    <span style={{ color: '#aaa', fontSize: '0.9rem' }}>{lesson.duration} min</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Challenges */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>🎯 Challenges ({selectedModule.challenges?.length || 0})</h3>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {selectedModule.challenges?.map((challenge: any, idx: number) => (
                  <div
                    key={idx}
                    style={{
                      padding: '1rem',
                      background: 'rgba(139, 92, 246, 0.1)',
                      border: '1px solid rgba(139, 92, 246, 0.2)',
                      borderRadius: '6px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <span>{challenge.title}</span>
                      <span style={{
                        marginLeft: '1rem',
                        padding: '0.25rem 0.5rem',
                        background: 'rgba(139, 92, 246, 0.2)',
                        borderRadius: '3px',
                        fontSize: '0.8rem',
                        color: '#aaa'
                      }}>
                        {challenge.difficulty}
                      </span>
                    </div>
                    <span style={{ color: '#fbbf24', fontWeight: '600' }}>+{challenge.points} pts</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Complete Button */}
            <button
              onClick={() => completeModule(selectedModule.id)}
              style={{
                width: '100%',
                padding: '1rem',
                background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                border: 'none',
                color: 'white',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem',
                marginTop: '1rem'
              }}
            >
              Complete Module & Get Rewards! 🎉
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
