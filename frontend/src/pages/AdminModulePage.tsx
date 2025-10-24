import React, { useState, useEffect } from 'react'
import axios from 'axios'

interface Module {
  id?: string
  title: string
  category: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number
  order: number
  content?: any
}

export const AdminModulePage = () => {
  const [modules, setModules] = useState<Module[]>([])
  const [form, setForm] = useState<Module>({
    title: '',
    category: 'c#',
    description: '',
    difficulty: 'beginner',
    duration: 30,
    order: 0,
    content: {}
  })
  const [editing, setEditing] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchModules()
  }, [])

  const fetchModules = async () => {
    try {
      const response = await axios.get('/api/modules')
      setModules(response.data)
    } catch (err) {
      setError('Failed to fetch modules')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm({
      ...form,
      [name]: name === 'duration' || name === 'order' ? parseInt(value) : value
    })
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const content = JSON.parse(e.target.value)
      setForm({ ...form, content })
    } catch (err) {
      // Invalid JSON - that's ok, just update the field
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('Not authenticated')
        return
      }

      const config = { headers: { Authorization: `Bearer ${token}` } }

      if (editing && editId) {
        // Update
        await axios.put(`/api/modules/${editId}`, form, config)
        setSuccess('Module updated successfully!')
      } else {
        // Create
        await axios.post('/api/modules', form, config)
        setSuccess('Module created successfully!')
      }

      // Reset form
      setForm({
        title: '',
        category: 'c#',
        description: '',
        difficulty: 'beginner',
        duration: 30,
        order: 0,
        content: {}
      })
      setEditing(false)
      setEditId(null)

      // Refresh list
      fetchModules()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save module')
    }
  }

  const handleEdit = (module: Module) => {
    setForm(module)
    setEditing(true)
    setEditId(module.id || null)
    window.scrollTo(0, 0)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this module?')) return

    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const config = { headers: { Authorization: `Bearer ${token}` } }
      await axios.delete(`/api/modules/${id}`, config)
      setSuccess('Module deleted successfully!')
      fetchModules()
    } catch (err) {
      setError('Failed to delete module')
    }
  }

  const handleCancel = () => {
    setForm({
      title: '',
      category: 'c#',
      description: '',
      difficulty: 'beginner',
      duration: 30,
      order: 0,
      content: {}
    })
    setEditing(false)
    setEditId(null)
  }

  return (
    <div className="admin-container">
      <h1>📚 Module Manager</h1>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="admin-grid">
        {/* Form Section */}
        <div className="form-section">
          <h2>{editing ? '✏️ Edit Module' : '➕ Create New Module'}</h2>

          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label>Module Title *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleInputChange}
                placeholder="e.g., C# Basics"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select name="category" value={form.category} onChange={handleInputChange} required>
                  <option value="c#">C#</option>
                  <option value="networking">Networking</option>
                  <option value="security">Security</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Difficulty *</label>
                <select name="difficulty" value={form.difficulty} onChange={handleInputChange} required>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Duration (minutes) *</label>
                <input
                  type="number"
                  name="duration"
                  value={form.duration}
                  onChange={handleInputChange}
                  min="5"
                  required
                />
              </div>

              <div className="form-group">
                <label>Order *</label>
                <input
                  type="number"
                  name="order"
                  value={form.order}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleInputChange}
                placeholder="Module description..."
                rows={3}
                required
              />
            </div>

            <div className="form-group">
              <label>Content (JSON)</label>
              <textarea
                value={JSON.stringify(form.content, null, 2)}
                onChange={handleContentChange}
                placeholder='{"text": "Content here", "codeExamples": []}'
                rows={6}
                className="code-input"
              />
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn-save">
                {editing ? '💾 Update Module' : '✨ Create Module'}
              </button>
              {editing && (
                <button type="button" onClick={handleCancel} className="btn-cancel">
                  ❌ Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Modules List */}
        <div className="list-section">
          <h2>📖 Existing Modules ({modules.length})</h2>

          {loading ? (
            <p>Loading...</p>
          ) : modules.length > 0 ? (
            <div className="modules-list">
              {modules.map(module => (
                <div key={module.id} className="module-item">
                  <div className="module-header">
                    <h3>{module.title}</h3>
                    <span className={`badge ${module.difficulty}`}>{module.difficulty}</span>
                  </div>
                  <p className="module-meta">
                    📁 {module.category} • ⏱️ {module.duration}min • 📊 Level {module.order}
                  </p>
                  <p className="module-desc">{module.description}</p>
                  <div className="module-actions">
                    <button
                      onClick={() => handleEdit(module)}
                      className="btn-edit"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => module.id && handleDelete(module.id)}
                      className="btn-delete"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#888' }}>No modules yet. Create one!</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminModulePage
