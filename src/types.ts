// src/types.ts
export interface WeeklyChartProps {
  data: Array<{ label: string; hours: number }>
}

export interface TaskPieChartProps {
  data: Array<{ name: string; value: number }>
}

export interface RoadmapItem {
  id: string
  user_id: string
  title: string
  description?: string
  target_hours: number
  completed_hours: number
  status: 'active' | 'completed' | 'paused'
  created_at: string
  updated_at: string
}

export interface TodayTask {
  id: string
  user_id: string
  title: string
  description?: string
  estimated_minutes: number
  completed: boolean
  priority: 'high' | 'medium' | 'low'
  created_at: string
  completed_at?: string
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