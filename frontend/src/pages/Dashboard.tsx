import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

interface Module {
  id: number
  title: string
  category: string
  description: string
  durationMinutes: number
  difficultyLevel: number
}

export default function Dashboard() {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('/api/modules', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setModules(response.data)
      } catch (err) {
        console.error('Failed to fetch modules:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchModules()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    navigate('/login')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', paddingBottom: '40px' }}>
      {/* Header */}
      <header style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>LernLix Dashboard</h1>
        <button onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '10px 20px', border: '1px solid white', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
          Logout
        </button>
      </header>

      {/* Container */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <h2 style={{ color: '#333', marginBottom: '30px', fontSize: '22px', fontWeight: '700' }}>Verfügbare Kurse</h2>

        {loading ? (
          <div style={{ textAlign: 'center', color: '#999' }}>Kurse werden geladen...</div>
        ) : modules.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#999' }}>Keine Kurse verfügbar</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
            {modules.map((module) => (
              <div key={module.id} style={{ background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', transition: 'transform 0.3s, box-shadow 0.3s', cursor: 'pointer' }} 
                   onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)'; }}
                   onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'; }}>
                <div style={{ background: module.category === 'csharp' ? '#667eea' : '#764ba2', color: 'white', padding: '8px 15px', borderRadius: '6px', display: 'inline-block', fontSize: '12px', fontWeight: '700', marginBottom: '15px' }}>
                  {module.category === 'csharp' ? 'C#' : 'Netzwerk'}
                </div>
                <h3 style={{ margin: '15px 0', color: '#333', fontSize: '18px', fontWeight: '700' }}>{module.title}</h3>
                <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6', marginBottom: '15px' }}>{module.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#999', marginBottom: '15px' }}>
                  <span>{module.durationMinutes} Min</span>
                  <span>Level {module.difficultyLevel}/5</span>
                </div>
                <button style={{ width: '100%', padding: '10px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', fontWeight: '700', borderRadius: '6px', border: 'none', cursor: 'pointer' }} onClick={() => navigate(`/learning?moduleId=${module.id}`)}>
                  Starten
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

