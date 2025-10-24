import React from 'react'
import { motion } from 'framer-motion'
import { Lock, Clock, Trophy } from 'lucide-react'

interface ModuleCardProps {
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
  onClick?: () => void
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  title,
  description,
  icon,
  type,
  duration,
  points,
  difficulty,
  completed,
  locked,
  onClick
}) => {
  const typeLabels = {
    'quick-start': '🚀 Quick-Start',
    'deep-dive': '🎓 Deep-Dive',
    'challenge': '⚔️ Challenge',
    'project': '🏗️ Projekt'
  }

  const typeColors = {
    'quick-start': 'from-blue-600 to-blue-400',
    'deep-dive': 'from-purple-600 to-purple-400',
    'challenge': 'from-red-600 to-red-400',
    'project': 'from-green-600 to-green-400'
  }

  const getDifficultyStars = () => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={i < difficulty ? '⭐' : '☆'} />
    ))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={`relative rounded-xl overflow-hidden cursor-pointer transition-all ${
        locked ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'
      }`}
      onClick={!locked ? onClick : undefined}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${typeColors[type]}`} />

      {/* Content */}
      <div className="relative p-6 space-y-4 text-white">
        {/* Header */}
        <div className="flex justify-between items-start">
          <span className="text-4xl">{icon}</span>
          {completed && <span className="text-2xl">✅</span>}
          {locked && <Lock size={20} className="text-yellow-300" />}
        </div>

        {/* Type Badge */}
        <div className="inline-block bg-black/30 px-3 py-1 rounded-full text-xs font-semibold">
          {typeLabels[type]}
        </div>

        {/* Title & Description */}
        <div>
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="text-sm text-gray-100 opacity-90 mt-1">{description}</p>
        </div>

        {/* Difficulty */}
        <div className="flex gap-0.5">{getDifficultyStars()}</div>

        {/* Footer Stats */}
        <div className="flex justify-between items-center pt-3 border-t border-white/20">
          <div className="flex gap-3 text-sm">
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{duration} Min</span>
            </div>
            <div className="flex items-center gap-1">
              <Trophy size={16} />
              <span>{points} Pts</span>
            </div>
          </div>
          {completed && (
            <span className="text-xs bg-green-500/30 px-2 py-1 rounded-full">Bestanden</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

