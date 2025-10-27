import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function RPGDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<any>(null)
  const [quests, setQuests] = useState<any[]>([])
  const [skills, setSkills] = useState<any[]>([])
  const [achievements, setAchievements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const API_URL = process.env.VITE_API_URL || '/api'

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      const token = localStorage.getItem('accessToken')

      // Fetch User Stats
      const statsRes = await fetch(`${API_URL}/stats/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const statsData = await statsRes.json()
      setStats(statsData.stats)

      // Fetch Quests
      const questsRes = await fetch(`${API_URL}/quests`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const questsData = await questsRes.json()
      setQuests(questsData.data || [])

      // Fetch Skills
      const skillsRes = await fetch(`${API_URL}/skills/tree`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const skillsData = await skillsRes.json()
      setSkills(skillsData.data || [])

      // Fetch Achievements
      const achievementsRes = await fetch(`${API_URL}/stats/me/achievements`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const achievementsData = await achievementsRes.json()
      setAchievements(achievementsData.data || [])

      setLoading(false)
    } catch (error) {
      console.error('Error fetching RPG data:', error)
      setLoading(false)
    }
  }

  const completeQuest = async (questId: string) => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch(`${API_URL}/quests/${questId}/complete`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      
      if (response.ok) {
        alert(`🎉 Quest completed! +${data.rewards.xp} XP, +${data.rewards.coins} Coins`)
        fetchAllData()
      }
    } catch (error) {
      console.error('Error completing quest:', error)
    }
  }

  const unlockSkill = async (skillId: string) => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch(`${API_URL}/skills/${skillId}/unlock`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      
      if (response.ok) {
        alert(`🎉 Skill unlocked: ${data.skill.name}`)
        fetchAllData()
      } else {
        alert(`❌ ${data.error}`)
      }
    } catch (error) {
      console.error('Error unlocking skill:', error)
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
          <p style={{ color: '#888' }}>Loading your RPG profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #111827 0%, #1a1a2e 50%, #0f0f1e 100%)',
      color: '#e5e7eb',
      padding: '2rem'
    }}>
      {/* HEADER */}
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
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
            <h1 style={{ fontSize: '2rem', margin: 0 }}>⚡ CodeSnap RPG</h1>
            <p style={{ margin: '0.5rem 0 0 0', color: '#aaa' }}>Level {stats?.level || 1} Learner</p>
          </div>
          <button
            onClick={() => { localStorage.clear(); navigate('/'); }}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.5)',
              color: '#fca5a5',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}
          >
            Logout
          </button>
        </div>

        {/* STATS OVERVIEW */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {[
            { icon: '⭐', label: 'Total XP', value: stats?.totalXP || 0 },
            { icon: '🪙', label: 'Coins', value: stats?.coins || 0 },
            { icon: '🔥', label: 'Streak', value: `${stats?.streak || 0} days` },
            { icon: '🏆', label: 'Quests Done', value: stats?.questsCompleted || 0 }
          ].map((item, idx) => (
            <div key={idx} style={{
              padding: '1.5rem',
              background: 'rgba(139, 92, 246, 0.05)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{item.icon}</div>
              <div style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '0.5rem' }}>{item.label}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* DAILY QUESTS */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🎯 Daily Quests ({quests.length})</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1rem'
          }}>
            {quests.slice(0, 6).map((quest) => (
              <div key={quest.id} style={{
                padding: '1.5rem',
                background: 'rgba(139, 92, 246, 0.05)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                borderRadius: '10px',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1rem' }}>{quest.title}</h3>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    background: quest.difficulty === 'hard' ? 'rgba(239, 68, 68, 0.2)' : quest.difficulty === 'medium' ? 'rgba(251, 146, 60, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                    color: quest.difficulty === 'hard' ? '#fca5a5' : quest.difficulty === 'medium' ? '#fed7aa' : '#86efac',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {quest.difficulty}
                  </span>
                </div>
                <p style={{ margin: '0.5rem 0', color: '#aaa', fontSize: '0.9rem' }}>{quest.description}</p>
                <div style={{ display: 'flex', gap: '1rem', margin: '1rem 0', fontSize: '0.9rem' }}>
                  <span>⭐ +{quest.xpReward} XP</span>
                  <span>🪙 +{quest.coinReward}</span>
                </div>
                <button
                  onClick={() => completeQuest(quest.id)}
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
                >
                  Complete Quest →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SKILL TREE */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🌳 Skill Tree ({skills.filter((s: any) => s.unlocked).length}/{skills.length})</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            {skills.slice(0, 8).map((skill: any) => (
              <div key={skill.id} style={{
                padding: '1rem',
                background: skill.unlocked ? 'rgba(34, 197, 94, 0.1)' : 'rgba(139, 92, 246, 0.05)',
                border: `1px solid ${skill.unlocked ? 'rgba(34, 197, 94, 0.3)' : 'rgba(139, 92, 246, 0.2)'}`,
                borderRadius: '8px',
                opacity: skill.unlocked ? 1 : 0.6,
                cursor: skill.unlocked ? 'default' : 'pointer',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{skill.icon}</div>
                <h4 style={{ margin: '0.5rem 0', fontSize: '0.95rem' }}>{skill.name}</h4>
                <p style={{ margin: '0.25rem 0', fontSize: '0.8rem', color: '#aaa' }}>Tier {skill.tier}</p>
                <p style={{ margin: '0.5rem 0 1rem 0', fontSize: '0.8rem', color: '#888' }}>XP: {skill.requiredXP}</p>
                {!skill.unlocked && (
                  <button
                    onClick={() => unlockSkill(skill.id)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      background: 'rgba(139, 92, 246, 0.2)',
                      border: '1px solid rgba(139, 92, 246, 0.5)',
                      color: '#8B5CF6',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}
                  >
                    Unlock
                  </button>
                )}
                {skill.unlocked && (
                  <div style={{ color: '#86efac', textAlign: 'center', fontSize: '0.9rem', fontWeight: '600' }}>
                    ✅ Unlocked
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ACHIEVEMENTS */}
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🏆 Achievements ({achievements.length})</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem'
          }}>
            {achievements.slice(0, 12).map((achievement: any, idx: number) => (
              <div key={idx} style={{
                padding: '1rem',
                background: 'rgba(139, 92, 246, 0.05)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{achievement.icon}</div>
                <h4 style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>{achievement.title}</h4>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#aaa' }}>{achievement.type}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
