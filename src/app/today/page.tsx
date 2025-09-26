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
    priority: 'medium' as 'high' | 'medium' | 'low'
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
    if (!newTask.title.trim() || !user) {
      console.error('Cannot add task: missing title or user')
      return
    }

    try {
      console.log('Adding task:', { newTask, userId: user.id }) // Debug log
      
      const taskData = {
        title: newTask.title.trim(),
        description: newTask.description.trim() || null,
        estimated_minutes: newTask.estimated_minutes || 25,
        priority: newTask.priority || 'medium',
        user_id: user.id,
        completed: false
      }
      
      const { data, error } = await supabase
        .from('today_tasks')
        .insert([taskData])
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      
      console.log('Task added successfully:', data) // Debug log
      setTasks(prev => [data, ...prev])
      setNewTask({ title: '', description: '', estimated_minutes: 25, priority: 'medium' })
      setShowAddTask(false)
    } catch (error) {
      console.error('Error adding task:', error)
      // Show user-friendly error
      alert('Failed to add task. Please try again.')
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
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Today's Focus</h1>
              <p className="text-gray-400">Stay focused, beat procrastination, achieve your goals</p>
            </div>
          </div>
          
          {/* Progress Stats */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-1">Today's Progress</div>
                <div className="text-3xl font-bold text-white">{completionRate}%</div>
                <div className="text-sm text-gray-500">{completedTasks}/{totalTasks} tasks completed</div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-400 mb-1">Motivational Quote</div>
                <p className="text-gray-300 text-sm italic max-w-md">
                  "{currentQuote}"
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Smart Pomodoro AI Coach */}
          <div className="xl:col-span-1">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Smart Pomodoro</h2>
                  <p className="text-gray-400 text-sm">AI-powered focus sessions</p>
                </div>
              </div>
              
              <SmartPomodoroAICoach 
                user={user}
                currentTask={selectedTask}
                onSessionComplete={() => {
                  console.log('Session completed')
                  fetchTasks()
                }}
              />
            </div>
          </div>

          {/* Tasks Section */}
          <div className="xl:col-span-2">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Today's Tasks</h2>
                    <p className="text-gray-400 text-sm">Focus on what matters most</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowAddTask(true)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" /> 
                  <span>Add Task</span>
                </button>
              </div>

              {/* Add Task Form */}
              {showAddTask && (
                <div className="mb-6 p-6 bg-gray-800 border border-gray-700 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-blue-400" />
                    Create New Task
                  </h3>
                  
                  <form onSubmit={addTask} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Task Title *</label>
                      <input
                        type="text"
                        placeholder="What do you want to accomplish?"
                        value={newTask.title}
                        onChange={(e) => setNewTask(prev => ({...prev, title: e.target.value}))}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-gray-600 transition-colors"
                        autoFocus
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Description (Optional)</label>
                      <textarea
                        placeholder="Add more details about this task..."
                        value={newTask.description}
                        onChange={(e) => setNewTask(prev => ({...prev, description: e.target.value}))}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-gray-600 transition-colors h-20 resize-none"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Estimated Time (minutes)</label>
                        <input
                          type="number"
                          min="5"
                          max="240"
                          value={newTask.estimated_minutes}
                          onChange={(e) => setNewTask(prev => ({...prev, estimated_minutes: parseInt(e.target.value) || 25}))}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:bg-gray-600 transition-colors"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                        <select
                          value={newTask.priority}
                          onChange={(e) => setNewTask(prev => ({...prev, priority: e.target.value as 'high' | 'medium' | 'low'}))}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:bg-gray-600 transition-colors"
                        >
                          <option value="low">Low Priority</option>
                          <option value="medium">Medium Priority</option>
                          <option value="high">High Priority</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                      >
                        Create Task
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddTask(false)
                          setNewTask({ title: '', description: '', estimated_minutes: 25, priority: 'medium' })
                        }}
                        className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Task List */}
              <div className="space-y-4">
                {tasks.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <BookOpen className="w-10 h-10 text-blue-400" />
                    </div>
                    <div className="text-white text-xl font-semibold mb-2">No tasks for today yet!</div>
                    <div className="text-gray-400 mb-6">Create your first task to get started on your productivity journey.</div>
                    <button
                      onClick={() => setShowAddTask(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      Add Your First Task
                    </button>
                  </div>
                ) : (
                  tasks.map((task, index) => (
                    <div
                      key={task.id}
                      className={`p-6 bg-gray-800 border rounded-lg transition-all duration-300 ${
                        task.completed 
                          ? 'border-green-600/50 bg-green-600/10' 
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => toggleTask(task.id, !task.completed)}
                          className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                            task.completed 
                              ? 'bg-green-600 border-green-600' 
                              : 'border-gray-400 hover:border-green-500 hover:bg-green-500/10'
                          }`}
                        >
                          {task.completed && <Check className="w-4 h-4 text-white" />}
                        </button>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className={`font-semibold text-lg ${
                              task.completed ? 'text-green-300 line-through' : 'text-white'
                            }`}>
                              {task.title}
                            </h3>
                            
                            <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                              task.priority === 'high' ? 'bg-red-600/20 text-red-300 border border-red-600/30' :
                              task.priority === 'medium' ? 'bg-yellow-600/20 text-yellow-300 border border-yellow-600/30' :
                              'bg-green-600/20 text-green-300 border border-green-600/30'
                            }`}>
                              {task.priority === 'high' ? '🔴 High' :
                               task.priority === 'medium' ? '🟡 Medium' : '🟢 Low'}
                            </span>
                            
                            {!task.completed && (
                              <button
                                onClick={() => {
                                  console.log('Selecting task:', task)
                                  setSelectedTask(task)
                                }}
                                className={`px-4 py-2 text-sm rounded-lg transition-all ${
                                  selectedTask?.id === task.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-700 text-blue-300 hover:bg-gray-600'
                                }`}
                              >
                                {selectedTask?.id === task.id ? '🎯 Selected for Focus' : 'Select for Focus'}
                              </button>
                            )}
                          </div>
                          
                          {task.description && (
                            <p className={`text-sm mb-3 leading-relaxed ${
                              task.completed ? 'text-green-300/80' : 'text-gray-300'
                            }`}>
                              {task.description}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-6 text-sm">
                            <div className={`flex items-center gap-2 ${
                              task.completed ? 'text-green-400' : 'text-gray-400'
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