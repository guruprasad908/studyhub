'use client'
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import SmartPomodoroAICoach from '../../components/SmartPomodoroAICoach'
import { 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Check, 
  Target,
  BookOpen,
  Timer,
  TrendingUp,
  Focus,
  Home,
  Zap
} from 'lucide-react'

interface Task {
  id: string
  title: string
  description: string
  estimated_minutes: number
  completed: boolean
  priority: 'high' | 'medium' | 'low'
  created_at: string
  completed_at?: string
}

interface PomodoroSession {
  workMinutes: number
  breakMinutes: number
  isActive: boolean
  timeLeft: number
  isBreak: boolean
  completedPomodoros: number
}

export default function TodayPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [newTask, setNewTask] = useState({ 
    title: '', 
    description: '', 
    estimated_minutes: 25, 
    priority: 'medium' as const 
  })
  const [showAddTask, setShowAddTask] = useState(false)
  
  // Pomodoro Timer State
  const [pomodoro, setPomodoro] = useState<PomodoroSession>({
    workMinutes: 25,
    breakMinutes: 5,
    isActive: false,
    timeLeft: 25 * 60,
    isBreak: false,
    completedPomodoros: 0
  })

  // Motivational quotes for anti-procrastination
  const motivationalQuotes = [
    "The way to get started is to quit talking and begin doing. - Walt Disney",
    "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
    "The future depends on what you do today. - Mahatma Gandhi",
    "You don't have to be great to get started, but you have to get started to be great. - Les Brown",
    "Success is the sum of small efforts repeated day in and day out. - Robert Collier"
  ]

  const [currentQuote] = useState(() => 
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  )

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user) {
      fetchTasks()
    }
  }, [user])

  // Pomodoro Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (pomodoro.isActive && pomodoro.timeLeft > 0) {
      interval = setInterval(() => {
        setPomodoro(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }))
      }, 1000)
    } else if (pomodoro.isActive && pomodoro.timeLeft === 0) {
      // Timer finished - play notification sound
      setPomodoro(prev => ({
        ...prev,
        isActive: false,
        isBreak: !prev.isBreak,
        timeLeft: prev.isBreak ? prev.workMinutes * 60 : prev.breakMinutes * 60,
        completedPomodoros: prev.isBreak ? prev.completedPomodoros : prev.completedPomodoros + 1
      }))
      
      // Simple notification
      alert(pomodoro.isBreak ? 'Break time is over! Ready to focus?' : 'Great work! Time for a break.')
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [pomodoro.isActive, pomodoro.timeLeft, pomodoro.isBreak])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (!user) {
        router.push('/auth')
        return
      }
    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/auth')
    } finally {
      setLoading(false)
    }
  }

  const fetchTasks = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const { data, error } = await supabase
        .from('today_tasks')
        .select('*')
        .eq('user_id', user?.id)
        .gte('created_at', today)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTasks(data || [])
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.title.trim()) return

    try {
      const { data, error } = await supabase
        .from('today_tasks')
        .insert([{
          ...newTask,
          user_id: user?.id,
          completed: false
        }])
        .select()

      if (error) throw error
      
      setTasks(prev => [data[0], ...prev])
      setNewTask({ title: '', description: '', estimated_minutes: 25, priority: 'medium' })
      setShowAddTask(false)
    } catch (error) {
      console.error('Error adding task:', error)
    }
  }

  const toggleTask = async (taskId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('today_tasks')
        .update({ 
          completed,
          completed_at: completed ? new Date().toISOString() : null
        })
        .eq('id', taskId)

      if (error) throw error
      
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, completed, completed_at: completed ? new Date().toISOString() : undefined } : task
      ))
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const startPomodoro = () => {
    setPomodoro(prev => ({ ...prev, isActive: true }))
  }

  const pausePomodoro = () => {
    setPomodoro(prev => ({ ...prev, isActive: false }))
  }

  const resetPomodoro = () => {
    setPomodoro(prev => ({
      ...prev,
      isActive: false,
      timeLeft: prev.isBreak ? prev.breakMinutes * 60 : prev.workMinutes * 60
    }))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  const completedTasks = tasks.filter(task => task.completed).length
  const totalTasks = tasks.length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 left-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse-soft"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse-soft" style={{animationDelay: '1s'}}></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="p-3 glass-button hover:bg-white/20 rounded-xl transition-all group"
            >
              <Home className="w-6 h-6 text-white group-hover:text-blue-300" />
            </button>
            <div>
              <h1 className="text-4xl font-bold gradient-text">Today's Focus</h1>
              <p className="text-slate-300 text-lg">Stay focused, beat procrastination, achieve your goals</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="floating-card p-6 text-center">
              <div className="text-sm text-slate-300 mb-1">Today's Progress</div>
              <div className="text-3xl font-bold gradient-text">{completionRate}%</div>
              <div className="text-xs text-slate-400">{completedTasks}/{totalTasks} tasks completed</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Smart Pomodoro AI Coach */}
          <div className="lg:col-span-1">
            <SmartPomodoroAICoach 
              user={user}
              currentTask={selectedTask}
              onSessionComplete={() => {
                console.log('Session completed') // Debug log
                fetchTasks() // Refresh tasks after session
              }}
            />
          </div>

          {/* Enhanced Tasks Section */}
          <div className="lg:col-span-2">
            <div className="floating-card p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-green-400/20 to-green-500/20 rounded-xl">
                    <Target className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Today's Tasks</h2>
                    <p className="text-slate-400">Focus on what matters most</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowAddTask(true)}
                  className="flex items-center gap-2 gradient-button px-6 py-3 rounded-xl transition-all group"
                >
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> 
                  <span>Add Task</span>
                </button>
              </div>

              {/* Enhanced Add Task Form */}
              {showAddTask && (
                <form onSubmit={addTask} className="mb-8 glass-card p-6 border border-blue-500/30 animate-slide-up">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-blue-400" />
                    Create New Task
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-300 mb-2">Task Title</label>
                      <input
                        type="text"
                        placeholder="What do you want to accomplish?"
                        value={newTask.title}
                        onChange={(e) => setNewTask(prev => ({...prev, title: e.target.value}))}
                        className="form-input w-full"
                        autoFocus
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-300 mb-2">Description (Optional)</label>
                      <textarea
                        placeholder="Add more details about this task..."
                        value={newTask.description}
                        onChange={(e) => setNewTask(prev => ({...prev, description: e.target.value}))}
                        className="form-input w-full h-24 resize-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Priority Level</label>
                      <select
                        value={newTask.priority}
                        onChange={(e) => setNewTask(prev => ({...prev, priority: e.target.value as any}))}
                        className="form-input w-full"
                      >
                        <option value="low">🟢 Low Priority</option>
                        <option value="medium">🟡 Medium Priority</option>
                        <option value="high">🔴 High Priority</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Estimated Time (minutes)</label>
                      <input
                        type="number"
                        placeholder="25"
                        value={newTask.estimated_minutes}
                        onChange={(e) => setNewTask(prev => ({...prev, estimated_minutes: parseInt(e.target.value) || 25}))}
                        className="form-input w-full"
                        min="5"
                        max="180"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-6">
                    <button
                      type="submit"
                      className="gradient-button px-6 py-3 rounded-lg flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Create Task
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddTask(false)}
                      className="glass-button px-6 py-3 rounded-lg text-white hover:text-red-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Enhanced Tasks List */}
              <div className="space-y-4">
                {tasks.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <BookOpen className="w-10 h-10 text-blue-300" />
                    </div>
                    <div className="text-slate-200 text-xl font-semibold mb-2">No tasks for today yet!</div>
                    <div className="text-slate-400 mb-6">Create your first task to get started on your productivity journey.</div>
                    <button
                      onClick={() => setShowAddTask(true)}
                      className="gradient-button px-6 py-3 rounded-lg inline-flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Add Your First Task
                    </button>
                  </div>
                ) : (
                  tasks.map((task, index) => (
                    <div
                      key={task.id}
                      className={`glass-card p-6 border transition-all duration-300 hover:subtle-glow animate-slide-up ${
                        task.completed 
                          ? 'border-green-400/30 bg-green-500/5' 
                          : 'border-white/10 hover:border-white/20'
                      }`}
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => toggleTask(task.id, !task.completed)}
                          className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all group ${
                            task.completed 
                              ? 'bg-green-500 border-green-500 shadow-lg shadow-green-500/50' 
                              : 'border-slate-400 hover:border-green-400 hover:bg-green-400/10'
                          }`}
                        >
                          {task.completed && <Check className="w-4 h-4 text-white" />}
                        </button>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className={`font-semibold text-lg ${
                              task.completed ? 'text-green-200 line-through' : 'text-white'
                            }`}>
                              {task.title}
                            </h3>
                            
                            <span className={`px-3 py-1 text-xs rounded-full border font-medium ${
                              task.priority === 'high' ? 'bg-red-500/20 text-red-200 border-red-400/30' :
                              task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30' :
                              'bg-green-500/20 text-green-200 border-green-400/30'
                            }`}>
                              {task.priority === 'high' ? '🔴 High' :
                               task.priority === 'medium' ? '🟡 Medium' : '🟢 Low'}
                            </span>
                            
                            {!task.completed && (
                              <button
                                onClick={() => {
                                  console.log('Selecting task:', task) // Debug log
                                  setSelectedTask(task)
                                }}
                                className={`px-4 py-2 text-sm rounded-lg transition-all ${
                                  selectedTask?.id === task.id
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                                    : 'glass-button text-blue-300 hover:text-blue-200'
                                }`}
                              >
                                {selectedTask?.id === task.id ? '🎯 Selected for Focus' : 'Select for Focus'}
                              </button>
                            )}
                          </div>
                          
                          {task.description && (
                            <p className={`text-sm mb-3 leading-relaxed ${
                              task.completed ? 'text-green-300/80' : 'text-slate-300'
                            }`}>
                              {task.description}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-6 text-sm">
                            <div className={`flex items-center gap-2 ${
                              task.completed ? 'text-green-400' : 'text-slate-400'
                            }`}>
                              <Clock className="w-4 h-4" />
                              <span>{task.estimated_minutes} minutes</span>
                            </div>
                            
                            {task.completed_at && (
                              <div className="flex items-center gap-2 text-green-400">
                                <Check className="w-4 h-4" />
                                <span>Completed at {new Date(task.completed_at).toLocaleTimeString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}