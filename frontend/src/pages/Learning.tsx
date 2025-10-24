import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

interface Module {
  id: number
  title: string
  category: string
  description: string
  content: any
  durationMinutes: number
}

export default function Learning() {
  const [searchParams] = useSearchParams()
  const [module, setModule] = useState<Module | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const moduleId = searchParams.get('moduleId')

  useEffect(() => {
    if (!moduleId) return

    const fetchModule = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`/api/modules/${moduleId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setModule(response.data)
      } catch (err) {
        console.error('Failed to fetch module:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchModule()
  }, [moduleId])

  if (loading) return <div style={{ textAlign: 'center', padding: '50px', color: '#999' }}>Modul wird geladen...</div>
  if (!module) return <div style={{ textAlign: 'center', padding: '50px', color: '#c33' }}>Modul nicht gefunden</div>

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <header style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>{module.title}</h1>
        <button onClick={() => navigate('/')} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '10px 20px', border: '1px solid white', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
          Zurück
        </button>
      </header>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ marginBottom: '20px', fontSize: '14px', color: '#666' }}>
            <strong>Dauer:</strong> {module.durationMinutes} Minuten | <strong>Kategorie:</strong> {module.category === 'csharp' ? 'C#' : 'Netzwerk'}
          </div>

          <div style={{ lineHeight: '1.8', color: '#333', fontSize: '16px' }}>
            <h2 style={{ color: '#333', marginBottom: '15px' }}>Beschreibung</h2>
            <p>{module.description}</p>

            {module.content?.sections && (
              <>
                <h2 style={{ color: '#333', marginTop: '30px', marginBottom: '15px' }}>Inhalte</h2>
                {module.content.sections.map((section: any, idx: number) => (
                  <div key={idx} style={{ marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>
                    <h3 style={{ color: '#667eea', marginBottom: '10px' }}>{section.title}</h3>
                    <p style={{ marginBottom: '10px', color: '#555' }}>{section.text}</p>
                    {section.codeExample && (
                      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '6px', overflow: 'auto', fontSize: '13px', lineHeight: '1.5', color: '#333', fontFamily: 'monospace' }}>
                        {section.codeExample}
                      </pre>
                    )}
                  </div>
                ))}
              </>
            )}

            {module.content?.quiz && (
              <>
                <h2 style={{ color: '#333', marginTop: '30px', marginBottom: '15px' }}>Fragen</h2>
                {module.content.quiz.map((q: any, idx: number) => (
                  <div key={idx} style={{ marginBottom: '20px', padding: '15px', background: '#f9f9f9', borderRadius: '6px' }}>
                    <p style={{ fontWeight: '700', marginBottom: '10px' }}>{q.question}</p>
                    {q.options.map((opt: string, oIdx: number) => (
                      <label key={oIdx} style={{ display: 'block', marginBottom: '8px', cursor: 'pointer' }}>
                        <input type="radio" name={`quiz-${idx}`} style={{ marginRight: '8px' }} /> {opt}
                      </label>
                    ))}
                  </div>
                ))}
              </>
            )}
          </div>

          <button style={{ marginTop: '30px', padding: '12px 30px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', fontWeight: '700', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '16px' }} onClick={() => alert('Modul als abgeschlossen markiert!')}>
            Als Abgeschlossen markieren
          </button>
        </div>
      </div>
    </div>
  )
}

