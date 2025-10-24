import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ModuleCard } from '../components/ModuleCard'

interface Module {
  id: string
  title: string
  description: string
  icon: string
  type: 'quick-start' | 'deep-dive' | 'challenge' | 'project'
  duration: number
  points: number
  difficulty: 1 | 2 | 3 | 4 | 5
  completed?: boolean
  locked?: boolean
}

const MODULES: Module[] = [
  // Quick-Start Module
  {
    id: 'qs-1',
    title: 'Erstelle deinen ersten Chatbot',
    description: 'Baue einen einfachen Chatbot in C#',
    icon: '🤖',
    type: 'quick-start',
    duration: 8,
    points: 50,
    difficulty: 1,
    completed: true
  },
  {
    id: 'qs-2',
    title: 'Baue eine Rechner-App',
    description: 'Implementiere einfache Berechnungen',
    icon: '🧮',
    type: 'quick-start',
    duration: 7,
    points: 50,
    difficulty: 1
  },
  {
    id: 'qs-3',
    title: 'Deine erste Schleife',
    description: 'Loop-Visualisierung und Zahlenausgabe',
    icon: '🔄',
    type: 'quick-start',
    duration: 10,
    points: 50,
    difficulty: 1
  },

  // Deep-Dive Module
  {
    id: 'dd-1',
    title: 'Wie Daten durch Netzwerkpakete fließen',
    description: 'OSI-Modell und Netzwerk-Visualisierung',
    icon: '🌐',
    type: 'deep-dive',
    duration: 35,
    points: 150,
    difficulty: 2
  },
  {
    id: 'dd-2',
    title: 'Objektorientierung verstehen',
    description: 'Interactive Story: Pizza-Bestellsystem',
    icon: '📦',
    type: 'deep-dive',
    duration: 40,
    points: 150,
    difficulty: 2
  },
  {
    id: 'dd-3',
    title: 'Async/Await Programmierung',
    description: 'Nicht-blockierendes Programmieren',
    icon: '⚡',
    type: 'deep-dive',
    duration: 25,
    points: 150,
    difficulty: 3
  },

  // Challenge Mode
  {
    id: 'ch-1',
    title: 'Debug Hunt',
    description: 'Finde und behebe Bugs im Code',
    icon: '🐛',
    type: 'challenge',
    duration: 10,
    points: 100,
    difficulty: 1
  },
  {
    id: 'ch-2',
    title: 'Algorithm Speedrun',
    description: 'Implementiere Algorithmen unter Zeitdruck',
    icon: '🏃',
    type: 'challenge',
    duration: 15,
    points: 250,
    difficulty: 3
  },
  {
    id: 'ch-3',
    title: 'Netzwerk-Puzzle',
    description: 'Rate-Limiting System implementieren',
    icon: '🧩',
    type: 'challenge',
    duration: 20,
    points: 500,
    difficulty: 4
  },

  // Projekt-Lab
  {
    id: 'pr-1',
    title: 'Baue eine Todo-App',
    description: 'Komplexes Projekt mit Datenbank',
    icon: '✅',
    type: 'project',
    duration: 120,
    points: 1000,
    difficulty: 4,
    locked: true
  }
]

export const ModulesPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'quick-start' | 'deep-dive' | 'challenge' | 'project'>('all')

  const filteredModules = filter === 'all' 
    ? MODULES 
    : MODULES.filter(m => m.type === filter)

  const stats = {
    completed: MODULES.filter(m => m.completed).length,
    total: MODULES.length,
    totalPoints: MODULES.filter(m => m.completed).reduce((sum, m) => sum + m.points, 0)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white"
      >
        <h1 className="text-4xl font-bold mb-2">📚 Lernmodule</h1>
        <p className="text-blue-100 mb-4">Wähle aus {MODULES.length} Modulen und lerne mit Spaß!</p>
        <div className="flex gap-6 text-sm">
          <div>
            <span className="font-bold">{stats.completed}/{stats.total}</span> Module abgeschlossen
          </div>
          <div>
            <span className="font-bold">{stats.totalPoints}</span> Punkte verdient
          </div>
        </div>
      </motion.div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'quick-start', 'deep-dive', 'challenge', 'project'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === f
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {f === 'all' && '📋 Alle'}
            {f === 'quick-start' && '🚀 Quick-Start'}
            {f === 'deep-dive' && '🎓 Deep-Dive'}
            {f === 'challenge' && '⚔️ Challenge'}
            {f === 'project' && '🏗️ Projekte'}
          </button>
        ))}
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map(module => (
          <ModuleCard
            key={module.id}
            {...module}
            onClick={() => console.log('Module clicked:', module.id)}
          />
        ))}
      </div>

      {filteredModules.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-gray-400 text-lg">Keine Module in dieser Kategorie gefunden</p>
        </motion.div>
      )}
    </div>
  )
}

