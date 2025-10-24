import React from 'react'
import { motion } from 'framer-motion'

interface StatCardProps {
  icon: string
  title: string
  value: string | number
  subtitle?: string
  color?: 'purple' | 'blue' | 'green' | 'orange' | 'red'
  onClick?: () => void
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  subtitle,
  color = 'purple',
  onClick
}) => {
  const colorMap = {
    purple: 'from-purple-600/20 to-purple-500/10 border-purple-500/20',
    blue: 'from-blue-600/20 to-blue-500/10 border-blue-500/20',
    green: 'from-green-600/20 to-green-500/10 border-green-500/20',
    orange: 'from-orange-600/20 to-orange-500/10 border-orange-500/20',
    red: 'from-red-600/20 to-red-500/10 border-red-500/20'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={`bg-gradient-to-br ${colorMap[color]} border rounded-lg p-6 cursor-pointer transition-all hover:shadow-lg`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </motion.div>
  )
}

