// src/types/index.ts

export interface User {
  id: string
  email: string
}

export interface RoadmapItem {
  id: string
  user_id: string
  title: string
  target_hours: number
  completed_hours: number
  created_at: string
  updated_at?: string
}

export interface PracticeSession {
  id: string
  user_id: string
  item_id: string
  started_at: string
  ended_at: string
  duration_minutes: number
  pomodoro: boolean
  created_at: string
}

export interface WeeklySummary {
  totalHours: number
  totalPomodoros: number
  daysStudied: number
  consistencyPct: number
  currentStreakDays: number
  hoursByDay: ChartDataPoint[]
  hoursByTask: ChartDataPoint[]
}

export interface ChartDataPoint {
  label?: string
  name?: string
  hours?: number
  value?: number
}

export interface EditingTarget {
  [itemId: string]: string
}

export interface Streaks {
  [itemId: string]: number
}

export interface Sessions {
  [itemId: string]: PracticeSession[]
}

export interface ShowSessions {
  [itemId: string]: boolean
}

// Component Props
export interface PomodoroTimerProps {
  user: User | null
  item: RoadmapItem | null
  onSessionComplete: () => void
  minutes?: number
}

export interface AuthFormProps {
  onSuccess?: (user: User | null) => void
}

export interface WeeklyChartProps {
  data: ChartDataPoint[]
}

export interface TaskPieChartProps {
  data: ChartDataPoint[]
}

export interface CardProps {
  children: React.ReactNode
  className?: string
}