import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useGamificationStore } from '../store/gamificationStore'
import { ProgressBar } from '../components/ProgressBar'
import { BadgeCard } from '../components/BadgeCard'
import { LeaderboardCard } from '../components/LeaderboardCard'

interface DashboardProps {
  onSelectModule: () => void
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectModule }) => {
  const { userStats, addPoints, unlockBadge, incrementStreak } = useGamificationStore()
  const [showLeaderboard, setShowLeaderboard] = useState(false)

  const allBadges = [
    { id: '1', name: 'First Coder', description: 'Erstes Modul abgeschlossen', icon: '💻' },
    { id: '2', name: 'Netzwerk-Ninja', description: '3 Netzwerk-Module', icon: '🥷' },
    { id: '3', name: 'OOP-Meister', description: '100% bei OOP-Modul', icon: '🎓' },
    { id: '4', name: 'Speed Demon', description: '5x unter 5 Min abgeschlossen', icon: '⚡' },
    { id: '5', name: 'Learning Warrior', description: '7-tägiger Streak', icon: '⚔️' },
  ]

  // Simulierte Leaderboard-Daten
  const leaderboardData = [
    { rank: 1, name: 'Code Master', points: 2500, level: 5, avatar: '👨‍💻', trend: 'up' as const },
    { rank: 2, name: 'Swift Learner', points: 2300, level: 5, avatar: '👩‍💻', trend: 'up' as const },
    { rank: 3, name: 'Debug Ninja', points: 2100, level: 4, avatar: '🥷', trend: 'stable' as const },
    { rank: 4, name: 'Du', points: userStats.totalPoints, level: userStats.currentLevel, avatar: '😊', trend: 'up' as const },
    { rank: 5, name: 'Network Pro', points: 1800, level: 4, avatar: '🌐', trend: 'down' as const },
  ]

  const handleAddPoints = () => {
    addPoints(100, 'Test Bonus')
    incrementStreak()
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white"
      >
        <h2 className="text-4xl font-bold mb-2">🎉 Willkommen zurück!</h2>
        <p className="text-lg text-purple-100">
          Du machst großartige Fortschritte! Dein Level: <span className="font-bold">{userStats.currentLevel}</span>
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Points Progress */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-800 rounded-xl p-6 border border-purple-500/20"
        >
          <h3 className="text-purple-300 text-sm font-semibold mb-4">⚡ Punkte bis nächstes Level</h3>
          <div className="mb-4">
            <div className="text-4xl font-bold text-white">
              {500 - (userStats.totalPoints % 500)}
            </div>
            <p className="text-gray-400 text-sm">von 500 Punkte</p>
          </div>
          <ProgressBar
            current={userStats.totalPoints % 500}
            total={500}
            color="from-yellow-400 to-orange-500"
          />
        </motion.div>

        {/* Weekly Goal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 rounded-xl p-6 border border-blue-500/20"
        >
          <h3 className="text-blue-300 text-sm font-semibold mb-4">🎯 Wöchentliches Ziel</h3>
          <div className="mb-4">
            <div className="text-4xl font-bold text-white">
              {userStats.weeklyProgress}/{userStats.weeklyGoal}
            </div>
            <p className="text-gray-400 text-sm">Punkte diese Woche</p>
          </div>
          <ProgressBar
            current={userStats.weeklyProgress}
            total={userStats.weeklyGoal}
            color="from-blue-400 to-cyan-500"
          />
        </motion.div>

        {/* Learning Streak */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 rounded-xl p-6 border border-red-500/20"
        >
          <h3 className="text-red-300 text-sm font-semibold mb-4">🔥 Learning Streak</h3>
          <div className="mb-4">
            <div className="text-4xl font-bold text-white">{userStats.learningStreak}</div>
            <p className="text-gray-400 text-sm">Tage in Folge</p>
          </div>
          <button
            onClick={handleAddPoints}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Test: +100 Punkte
          </button>
        </motion.div>
      </div>

      {/* Badges Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          🏅 Deine Badges <span className="text-purple-400">({userStats.badges.length}/{allBadges.length})</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {allBadges.map((badge) => (
            <BadgeCard
              key={badge.id}
              name={badge.name}
              description={badge.description}
              icon={badge.icon}
              unlocked={userStats.badges.some(b => b.id === badge.id)}
              unlockedAt={userStats.badges.find(b => b.id === badge.id)?.unlockedAt}
            />
          ))}
        </div>
      </motion.div>

      {/* Leaderboard Toggle & Display */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        <button
          onClick={() => setShowLeaderboard(!showLeaderboard)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition w-full md:w-auto"
        >
          {showLeaderboard ? '❌ Leaderboard ausblenden' : '🏆 Leaderboard anzeigen'}
        </button>

        {showLeaderboard && (
          <div className="bg-gray-800 rounded-xl p-6 border border-purple-500/20">
            <LeaderboardCard
              entries={leaderboardData}
              currentUserRank={4}
            />
          </div>
        )}
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex gap-4"
      >
        <button
          onClick={onSelectModule}
          className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition transform hover:scale-105"
        >
          📚 Zu den Modulen
        </button>
        <button
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded-xl transition"
        >
          🎯 Nächste Challenge
        </button>
      </motion.div>
    </div>
  )
}

