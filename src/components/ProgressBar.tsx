import React from 'react'
import { motion } from 'framer-motion'

interface ProgressBarProps {
  current: number
  total: number
  milestone?: string
  color?: string
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  milestone,
  color = 'from-blue-500 to-purple-600'
}) => {
  const percentage = (current / total) * 100

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">
          {current} / {total} Punkte
        </span>
        {milestone && (
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
            🎯 {milestone}
          </span>
        )}
      </div>
      
      <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>

      <div className="flex gap-2 text-xs text-gray-600">
        <span>✅ {Math.round(percentage)}%</span>
      </div>
    </div>
  )
}

