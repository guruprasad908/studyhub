// src/lib/demoData.ts
// Demo data for when Supabase is not configured

export const demoRoadmapItems = [
  {
    id: 'demo-1',
    title: 'Master JavaScript Fundamentals',
    description: 'Learn ES6+, async/await, and modern JavaScript concepts',
    target_hours: 40,
    completed_hours: 28,
    status: 'active' as const,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'demo-2', 
    title: 'React & Next.js Development',
    description: 'Build modern web applications with React and Next.js',
    target_hours: 60,
    completed_hours: 45,
    status: 'active' as const,
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'demo-3',
    title: 'Database Design & SQL',
    description: 'Learn database fundamentals and advanced SQL queries',
    target_hours: 30,
    completed_hours: 30,
    status: 'completed' as const,
    created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  }
]

export const demoTodayTasks = [
  {
    id: 'task-1',
    title: 'Review JavaScript Closures',
    description: 'Study closure concepts and practical examples',
    estimated_minutes: 45,
    completed: false,
    priority: 'high' as const,
    created_at: new Date().toISOString()
  },
  {
    id: 'task-2',
    title: 'Practice React Hooks',
    description: 'Build a small project using useState and useEffect',
    estimated_minutes: 90,
    completed: true,
    priority: 'medium' as const,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    completed_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: 'task-3',
    title: 'Read Database Documentation',
    description: 'Go through PostgreSQL documentation chapters 1-3',
    estimated_minutes: 60,
    completed: false,
    priority: 'low' as const,
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  }
]

export const demoWeeklySummary = {
  totalHours: 12.5,
  totalPomodoros: 24,
  daysStudied: 5,
  consistencyPct: 71,
  currentStreakDays: 3,
  hoursByDay: [
    { label: 'Mon 9/16', hours: 2.5 },
    { label: 'Tue 9/17', hours: 1.8 },
    { label: 'Wed 9/18', hours: 0 },
    { label: 'Thu 9/19', hours: 3.2 },
    { label: 'Fri 9/20', hours: 2.1 },
    { label: 'Sat 9/21', hours: 1.9 },
    { label: 'Sun 9/22', hours: 1.0 }
  ],
  hoursByTask: [
    { name: 'JavaScript', value: 5.2 },
    { name: 'React/Next.js', value: 4.8 },
    { name: 'Database', value: 2.5 }
  ]
}

export const isDemoMode = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder') || 
         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.includes('placeholder')
}