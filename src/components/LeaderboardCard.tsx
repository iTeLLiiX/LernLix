import React from 'react'
import { Trophy, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

interface LeaderboardEntry {
  rank: number
  name: string
  points: number
  level: number
  avatar: string
  trend: 'up' | 'down' | 'stable'
}

interface LeaderboardCardProps {
  entries: LeaderboardEntry[]
  currentUserRank?: number
}

export const LeaderboardCard: React.FC<LeaderboardCardProps> = ({
  entries,
  currentUserRank
}) => {
  const getMedalEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇'
      case 2:
        return '🥈'
      case 3:
        return '🥉'
      default:
        return `#${rank}`
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="text-yellow-500" size={24} />
        <h2 className="text-xl font-bold">🏆 Leaderboard</h2>
      </div>

      <div className="space-y-2">
        {entries.map((entry, index) => (
          <motion.div
            key={entry.rank}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              currentUserRank === entry.rank
                ? 'bg-blue-100 border-2 border-blue-500'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <span className="text-2xl w-8 text-center">
              {getMedalEmoji(entry.rank)}
            </span>
            <span className="text-lg">{entry.avatar}</span>
            <div className="flex-1">
              <p className="font-semibold text-sm">{entry.name}</p>
              <p className="text-xs text-gray-600">Level {entry.level}</p>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-purple-600">{entry.points}</span>
              {entry.trend === 'up' && <TrendingUp size={16} className="text-green-500" />}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

