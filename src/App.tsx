import React, { useState } from 'react'
import { useGamificationStore } from './store/gamificationStore'
import { Dashboard } from './pages/Dashboard'
import { ModuleView } from './pages/ModuleView'
import './App.css'

type Page = 'dashboard' | 'module' | 'challenges'

export function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [selectedModule, setSelectedModule] = useState<string>('')
  const { userStats } = useGamificationStore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🚀</span>
            <h1 className="text-2xl font-bold text-white">LernLix</h1>
          </div>

          <div className="flex items-center gap-6 text-white">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚡</span>
              <span className="font-semibold">{userStats.totalPoints}</span>
              <span className="text-gray-400">Punkte</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xl">📊</span>
              <span className="font-semibold">Level {userStats.currentLevel}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xl">🔥</span>
              <span className="font-semibold">{userStats.learningStreak}</span>
              <span className="text-gray-400">Streak</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 flex gap-4 border-t border-purple-500/10 pt-4">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              currentPage === 'dashboard'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setCurrentPage('challenges')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              currentPage === 'challenges'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            ⚔️ Challenges
          </button>
          <button
            onClick={() => setCurrentPage('module')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              currentPage === 'module'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📚 Module
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentPage === 'dashboard' && <Dashboard onSelectModule={() => setCurrentPage('module')} />}
        {currentPage === 'module' && <ModuleView moduleId={selectedModule} />}
      </main>
    </div>
  )
}

export default App

