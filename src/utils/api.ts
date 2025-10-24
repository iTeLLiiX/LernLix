import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request Interceptor
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// Response Interceptor
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Module API
export const moduleAPI = {
  getAll: () => apiClient.get('/modules'),
  getById: (id: string) => apiClient.get(`/modules/${id}`),
  start: (id: string) => apiClient.post(`/modules/${id}/start`),
  complete: (id: string, timeSpent: number) => 
    apiClient.post(`/modules/${id}/complete`, { timeSpent })
}

// Challenge API
export const challengeAPI = {
  getAll: () => apiClient.get('/challenges'),
  getById: (id: string) => apiClient.get(`/challenges/${id}`),
  start: (id: string) => apiClient.post(`/challenges/${id}/start`),
  submit: (id: string, code: string, timeSpent: number) =>
    apiClient.post(`/challenges/${id}/submit`, { code, timeSpent }),
  getLeaderboard: (id: string) => apiClient.get(`/challenges/${id}/leaderboard`)
}

// Gamification API
export const gamificationAPI = {
  getStats: () => apiClient.get('/gamification/stats'),
  getBadges: () => apiClient.get('/gamification/badges'),
  recordEvent: (eventType: string, points: number, metadata?: Record<string, any>) =>
    apiClient.post('/gamification/event', { eventType, points, metadata })
}

// Leaderboard API
export const leaderboardAPI = {
  getGlobal: (limit = 50) => apiClient.get(`/leaderboard/global?limit=${limit}`),
  getWeekly: (limit = 50) => apiClient.get(`/leaderboard/weekly?limit=${limit}`),
  getFriends: (limit = 50) => apiClient.get(`/leaderboard/friends?limit=${limit}`)
}

// Code Execution API
export const codeAPI = {
  execute: (code: string, language = 'csharp', testCases: string[] = []) =>
    apiClient.post('/code/execute', { code, language, testCases }),
  lint: (code: string, language = 'csharp') =>
    apiClient.post('/code/lint', { code, language })
}

export default apiClient

