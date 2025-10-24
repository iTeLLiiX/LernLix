import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

export default function Register() {
  const [formData, setFormData] = useState({ email: '', password: '', firstName: '', lastName: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/auth/register', formData)
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('refreshToken', response.data.refreshToken)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px', fontSize: '28px', fontWeight: '700' }}>Registrierung</h1>
        
        {error && <div style={{ background: '#fee', border: '1px solid #fcc', color: '#c33', padding: '10px', borderRadius: '6px', marginBottom: '20px' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <input type="text" name="firstName" placeholder="Vorname" value={formData.firstName} onChange={handleChange} required style={{ width: '100%', marginBottom: '15px', padding: '12px', border: '2px solid #ddd', borderRadius: '8px' }} />
          <input type="text" name="lastName" placeholder="Nachname" value={formData.lastName} onChange={handleChange} required style={{ width: '100%', marginBottom: '15px', padding: '12px', border: '2px solid #ddd', borderRadius: '8px' }} />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required style={{ width: '100%', marginBottom: '15px', padding: '12px', border: '2px solid #ddd', borderRadius: '8px' }} />
          <input type="password" name="password" placeholder="Passwort" value={formData.password} onChange={handleChange} required style={{ width: '100%', marginBottom: '25px', padding: '12px', border: '2px solid #ddd', borderRadius: '8px' }} />
          <button type="submit" style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', fontWeight: '700', marginBottom: '15px' }}>Registrieren</button>
        </form>

        <div style={{ textAlign: 'center', color: '#666' }}>
          Bereits registriert? <Link to="/login" style={{ color: '#667eea', fontWeight: '600' }}>Hier anmelden</Link>
        </div>
      </div>
    </div>
  )
}

