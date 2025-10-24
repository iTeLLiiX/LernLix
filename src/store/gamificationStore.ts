import { create } from 'zustand'

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt?: Date
}

export interface UserStats {
  totalPoints: number
  currentLevel: number
  badges: Badge[]
  completedModules: string[]
  learningStreak: number
  weeklyGoal: number
  weeklyProgress: number
}

export interface LearningGoal {
  id: string
  title: string
  targetPoints: number
  deadline: Date
  completed: boolean
}

interface GamificationStore {
  userStats: UserStats
  learningGoals: LearningGoal[]
  
  addPoints: (points: number, reason: string) => void
  unlockBadge: (badge: Badge) => void
  completeModule: (moduleId: string) => void
  setWeeklyProgress: (progress: number) => void
  addLearningGoal: (goal: LearningGoal) => void
  completeLearningGoal: (goalId: string) => void
  incrementStreak: () => void
  resetStreak: () => void
  getUserLevel: () => number
  getLevelProgress: () => number
}

const calculateLevel = (points: number): number => {
  return Math.floor(points / 500) + 1
}

const calculateLevelProgress = (points: number): number => {
  const pointsInCurrentLevel = points % 500
  return (pointsInCurrentLevel / 500) * 100
}

export const useGamificationStore = create<GamificationStore>((set, get) => ({
  userStats: {
    totalPoints: 0,
    currentLevel: 1,
    badges: [],
    completedModules: [],
    learningStreak: 0,
    weeklyGoal: 1000,
    weeklyProgress: 0
  },
  
  learningGoals: [],

  addPoints: (points: number, reason: string) => {
    set((state) => {
      const newTotalPoints = state.userStats.totalPoints + points
      return {
        userStats: {
          ...state.userStats,
          totalPoints: newTotalPoints,
          currentLevel: calculateLevel(newTotalPoints),
          weeklyProgress: state.userStats.weeklyProgress + points
        }
      }
    })
  },

  unlockBadge: (badge: Badge) => {
    set((state) => {
      const badgeExists = state.userStats.badges.some(b => b.id === badge.id)
      if (!badgeExists) {
        return {
          userStats: {
            ...state.userStats,
            badges: [...state.userStats.badges, { ...badge, unlockedAt: new Date() }]
          }
        }
      }
      return state
    })
  },

  completeModule: (moduleId: string) => {
    set((state) => {
      if (!state.userStats.completedModules.includes(moduleId)) {
        return {
          userStats: {
            ...state.userStats,
            completedModules: [...state.userStats.completedModules, moduleId]
          }
        }
      }
      return state
    })
  },

  setWeeklyProgress: (progress: number) => {
    set((state) => ({
      userStats: {
        ...state.userStats,
        weeklyProgress: progress
      }
    }))
  },

  addLearningGoal: (goal: LearningGoal) => {
    set((state) => ({
      learningGoals: [...state.learningGoals, goal]
    }))
  },

  completeLearningGoal: (goalId: string) => {
    set((state) => ({
      learningGoals: state.learningGoals.map(goal =>
        goal.id === goalId ? { ...goal, completed: true } : goal
      )
    }))
  },

  incrementStreak: () => {
    set((state) => ({
      userStats: {
        ...state.userStats,
        learningStreak: state.userStats.learningStreak + 1
      }
    }))
  },

  resetStreak: () => {
    set((state) => ({
      userStats: {
        ...state.userStats,
        learningStreak: 0
      }
    }))
  },

  getUserLevel: () => {
    return get().userStats.currentLevel
  },

  getLevelProgress: () => {
    return calculateLevelProgress(get().userStats.totalPoints)
  }
}))

