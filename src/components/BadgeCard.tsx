import React from 'react'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'

interface BadgeCardProps {
  name: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: Date
}

export const BadgeCard: React.FC<BadgeCardProps> = ({
  name,
  description,
  icon,
  unlocked,
  unlockedAt
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`relative p-4 rounded-lg text-center cursor-pointer transition-all ${
        unlocked
          ? 'bg-gradient-to-br from-yellow-100 to-yellow-50 border-2 border-yellow-400 shadow-lg hover:shadow-xl'
          : 'bg-gray-100 border-2 border-gray-300 opacity-60'
      }`}
    >
      {!unlocked && (
        <div className="absolute top-2 right-2">
          <Lock size={16} className="text-gray-400" />
        </div>
      )}

      <div className="text-4xl mb-2">{icon}</div>
      <h3 className="font-bold text-sm">{name}</h3>
      <p className="text-xs text-gray-600 mt-1">{description}</p>

      {unlocked && unlockedAt && (
        <p className="text-xs text-yellow-600 mt-2">
          🎉 {unlockedAt.toLocaleDateString('de-DE')}
        </p>
      )}
    </motion.div>
  )
}

