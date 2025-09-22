'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Home, Clock, Target, BookOpen, Timer, Play, Plus, Minus, Edit3, Check, X, LogOut, Activity, BarChart3, Calendar
} from 'lucide-react'
import WeeklyChart from '../../components/WeeklyChart'
import TaskPieChart from '../../components/TaskPieChart'
import PersonalizedContentRecommendations from '../../components/PersonalizedContentRecommendations'
import AIStudyAnalytics from '../../components/AIStudyAnalytics'
import AIStudyGroupMatcher from '../../components/AIStudyGroupMatcher'
import AIFocusOptimizer from '../../components/AIFocusOptimizer'
import AIAdaptiveLearning from '../../components/AIAdaptiveLearning'

interface RoadmapItem {
  id: string; title: string; target_hours: number; completed_hours: number; created_at: string
}

interface WeeklySummary {
  totalHours: number; totalPomodoros: number; daysStudied: number; consistencyPct: number
  currentStreakDays: number; hoursByDay: Array<{ label: string; hours: number }>
  hoursByTask: Array<{ name: string; value: number }>
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<RoadmapItem[]>([])
  const [newTitle, setNewTitle] = useState('')
  const [editingTarget, setEditingTarget] = useState<Record<string, string>>({})
  const [selectedItemId, setSelectedItemId] = useState('')
  const [pomMinutes, setPomMinutes] = useState(25)
  const [weeklySummary, setWeeklySummary] = useState<WeeklySummary>({
    totalHours: 0, totalPomodoros: 0, daysStudied: 0, consistencyPct: 0,
    currentStreakDays: 0, hoursByDay: [], hoursByTask: []
  })

  useEffect(() => { checkUser() }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (!user) { router.push('/auth'); return }
      
      // Handle each promise individually to prevent unhandled rejections
      try {
        await fetchItems(user.id)
      } catch (error) {
        console.error('Error fetching items:', error)
      }
      
      try {
        await fetchWeeklySummary(user.id)
      } catch (error) {
        console.error('Error fetching weekly summary:', error)
      }
    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/auth')
    } finally {
      setLoading(false)
    }
  }

  const fetchItems = async (userId: string) => {
    try {
      const { data, error } = await supabase.from('roadmap_items').select('*')
        .eq('user_id', userId).order('created_at', { ascending: false })
      if (error) throw error
      setItems(data || [])
    } catch (error) { console.error('Error fetching items:', error) }
  }

  const fetchWeeklySummary = async (userId: string) => {
    try {
      const since = new Date(); since.setDate(since.getDate() - 6)
      const { data: sessions, error } = await supabase.from('practice_sessions')
        .select('id, item_id, created_at, duration_minutes, pomodoro')
        .eq('user_id', userId).gte('created_at', since.toISOString())
      if (error) throw error

      const dayBuckets: Array<{ label: string; hours: number }> = []
      const taskMinutes: Record<string, number> = {}
      let totalMinutes = 0, totalPomodoros = 0
      const daysSet = new Set<string>()

      for (let i = 6; i >= 0; i--) {
        const date = new Date(); date.setDate(date.getDate() - i)
        dayBuckets.push({ label: date.toLocaleDateString(undefined, { weekday: 'short', month: 'numeric', day: 'numeric' }), hours: 0 })
      }

      ;(sessions || []).forEach(session => {
        const minutes = Number(session.duration_minutes || 0)
        totalMinutes += minutes
        if (session.pomodoro) totalPomodoros++
        const dayKey = new Date(session.created_at).toISOString().slice(0, 10)
        daysSet.add(dayKey)
        const dayIndex = 6 - Math.floor((Date.now() - new Date(session.created_at).getTime()) / (24 * 60 * 60 * 1000))
        if (dayIndex >= 0 && dayIndex < 7) dayBuckets[dayIndex].hours += minutes / 60
        if (session.item_id) taskMinutes[session.item_id] = (taskMinutes[session.item_id] || 0) + minutes
      })

      const taskData: Array<{ name: string; value: number }> = []
      if (Object.keys(taskMinutes).length > 0) {
        const { data: taskTitles } = await supabase.from('roadmap_items')
          .select('id, title').in('id', Object.keys(taskMinutes))
        const titleMap = Object.fromEntries((taskTitles || []).map(t => [t.id, t.title]))
        Object.entries(taskMinutes).forEach(([itemId, minutes]) => {
          taskData.push({ name: titleMap[itemId] || `Task ${itemId.slice(0, 6)}`, value: +(minutes / 60).toFixed(2) })
        })
      }

      let currentStreakDays = 0; const today = new Date()
      for (let i = 0; i < 7; i++) {
        const date = new Date(); date.setDate(today.getDate() - i)
        if (daysSet.has(date.toISOString().slice(0, 10))) currentStreakDays++; else break
      }

      setWeeklySummary({
        totalHours: +(totalMinutes / 60).toFixed(1), totalPomodoros, daysStudied: daysSet.size,
        consistencyPct: Math.round((daysSet.size / 7) * 100), currentStreakDays,
        hoursByDay: dayBuckets.map(b => ({ ...b, hours: +b.hours.toFixed(2) })), hoursByTask: taskData
      })
    } catch (error) { console.error('Error fetching weekly summary:', error) }
  }

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault(); if (!newTitle.trim() || !user) return
    try {
      const { data, error } = await supabase.from('roadmap_items').insert([{
        user_id: user.id, title: newTitle.trim(), target_hours: 20, completed_hours: 0
      }]).select().single()
      if (error) throw error
      setItems(prev => [data, ...prev]); setNewTitle(''); await fetchWeeklySummary(user.id)
    } catch (error) { console.error('Error adding item:', error) }
  }

  const updateHours = async (itemId: string, newValue: number) => {
    try {
      const { error } = await supabase.from('roadmap_items')
        .update({ completed_hours: Math.max(0, newValue) }).eq('id', itemId)
      if (error) throw error
      setItems(prev => prev.map(item => item.id === itemId ? { ...item, completed_hours: Math.max(0, newValue) } : item))
      await fetchWeeklySummary(user!.id)
    } catch (error) { console.error('Error updating hours:', error) }
  }

  const saveTargetHours = async (itemId: string) => {
    const rawValue = editingTarget[itemId]; if (!rawValue) return
    const value = Number(rawValue)
    if (isNaN(value) || value < 0) { alert('Please enter a valid number'); return }
    try {
      const { error } = await supabase.from('roadmap_items').update({ target_hours: value }).eq('id', itemId)
      if (error) throw error
      setItems(prev => prev.map(item => item.id === itemId ? { ...item, target_hours: value } : item))
      setEditingTarget(prev => { const newState = { ...prev }; delete newState[itemId]; return newState })
    } catch (error) { console.error('Error saving target hours:', error) }
  }

  const addPracticeSession = async (itemId: string, minutes: number, isPomodoro: boolean = false) => {
    if (!user) return
    try {
      const { error } = await supabase.from('practice_sessions').insert([{
        user_id: user.id, item_id: itemId, started_at: new Date().toISOString(),
        ended_at: new Date().toISOString(), duration_minutes: minutes, pomodoro: isPomodoro
      }])
      if (error) throw error
      await fetchWeeklySummary(user.id)
    } catch (error) { console.error('Error adding practice session:', error) }
  }

  const getProgressPercentage = (item: RoadmapItem) => {
    if (!item.target_hours || item.target_hours <= 0) return 0
    return Math.min(100, Math.round((item.completed_hours / item.target_hours) * 100))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/')} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
              <Home className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Study Dashboard</h1>
              <p className="text-blue-200">Track your progress and analyze your study patterns</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/today" className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
              <Clock className="w-4 h-4" /> Today's Focus
            </Link>
            <Link href="/roadmap" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              <Target className="w-4 h-4" /> Roadmap
            </Link>
            <button onClick={() => { supabase.auth.signOut(); router.push('/') }} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg"><Clock className="w-5 h-5 text-blue-400" /></div>
              <div><div className="text-2xl font-bold text-white">{weeklySummary.totalHours}h</div><div className="text-blue-200 text-sm">This Week</div></div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg"><Timer className="w-5 h-5 text-red-400" /></div>
              <div><div className="text-2xl font-bold text-white">{weeklySummary.totalPomodoros}</div><div className="text-blue-200 text-sm">Pomodoros</div></div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg"><Calendar className="w-5 h-5 text-green-400" /></div>
              <div><div className="text-2xl font-bold text-white">{weeklySummary.daysStudied}/7</div><div className="text-blue-200 text-sm">Days Active</div></div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg"><Activity className="w-5 h-5 text-purple-400" /></div>
              <div><div className="text-2xl font-bold text-white">{weeklySummary.currentStreakDays}d</div><div className="text-blue-200 text-sm">Current Streak</div></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Charts */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">Study Analytics</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-white font-medium mb-3">Weekly Hours</h3>
                <WeeklyChart data={weeklySummary.hoursByDay} />
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-white font-medium mb-3">Time by Subject</h3>
                <TaskPieChart data={weeklySummary.hoursByTask} />
              </div>
            </div>
            <div className="mt-6 bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">Consistency Rate</span>
                <span className="text-white text-lg font-bold">{weeklySummary.consistencyPct}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500" style={{ width: `${weeklySummary.consistencyPct}%` }}></div>
              </div>
            </div>
          </div>

          {/* AI Study Analytics */}
          <div className="lg:col-span-1 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <AIStudyAnalytics 
              user={user} 
              studyData={{
                sessions: [], // We'll populate this with actual data
                tasks: items,
                weeklySummary: weeklySummary
              }} 
            />
          </div>

          {/* Quick Actions */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-2 mb-6">
              <Play className="w-5 h-5 text-green-400" />
              <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-blue-200 text-sm mb-2">Select Study Goal</label>
                <select value={selectedItemId} onChange={(e) => setSelectedItemId(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-400">
                  <option value="">Choose a goal...</option>
                  {items.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-blue-200 text-sm mb-2">Session Duration</label>
                <select value={pomMinutes} onChange={(e) => setPomMinutes(Number(e.target.value))} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-400">
                  <option value={5}>5 minutes</option><option value={15}>15 minutes</option><option value={25}>25 minutes</option><option value={50}>50 minutes</option>
                </select>
              </div>
              <button onClick={() => { if (!selectedItemId) { alert('Please select a study goal first'); return }; addPracticeSession(selectedItemId, pomMinutes, true) }} className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105" disabled={!selectedItemId}>
                🍅 Log Pomodoro Session
              </button>
              <button onClick={() => { if (user) { fetchItems(user.id); fetchWeeklySummary(user.id) } }} className="w-full bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg transition-colors">
                🔄 Refresh Data
              </button>
            </div>
          </div>
        </div>

        {/* Personalized Content Recommendations */}
        <div className="mb-8">
          <PersonalizedContentRecommendations 
            user={user} 
            studyData={{
              sessions: [], // We'll populate this with actual data
              tasks: items,
              weeklySummary: weeklySummary
            }} 
          />
        </div>

        {/* AI Study Group Matcher */}
        <div className="mb-8">
          <AIStudyGroupMatcher 
            user={user} 
            studyData={{
              sessions: [], // We'll populate this with actual data
              tasks: items,
              weeklySummary: weeklySummary
            }} 
            allUsersData={[]} // In a real implementation, this would come from the database
          />
        </div>

        {/* AI Focus Optimizer */}
        <div className="mb-8">
          <AIFocusOptimizer 
            user={user} 
            studyData={{
              sessions: [], // We'll populate this with actual data
              tasks: items,
              weeklySummary: weeklySummary
            }} 
          />
        </div>

        {/* AI Adaptive Learning */}
        <div className="mb-8">
          <AIAdaptiveLearning 
            user={user} 
            studyData={{
              sessions: [], // We'll populate this with actual data
              tasks: items,
              weeklySummary: weeklySummary
            }} 
          />
        </div>

        {/* Add New Goal */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Plus className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-semibold text-white">Add New Study Goal</h2>
          </div>
          <form onSubmit={addItem} className="flex gap-4">
            <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Enter your study goal (e.g., Master React Hooks)" className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:border-blue-400" />
            <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors font-medium">Add Goal</button>
          </form>
        </div>

        {/* Study Goals List */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-semibold text-white">Your Study Goals</h2>
          </div>
          {items.length === 0 ? (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-blue-300 mx-auto mb-4" />
              <div className="text-blue-200 mb-2">No study goals yet!</div>
              <div className="text-blue-300 text-sm">Add your first goal above to start tracking your progress.</div>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const progress = getProgressPercentage(item)
                const isEditing = editingTarget[item.id] !== undefined
                return (
                  <div key={item.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg">{item.title}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <div className="text-blue-200">Target: {isEditing ? (
                            <input type="number" value={editingTarget[item.id]} onChange={(e) => setEditingTarget(prev => ({ ...prev, [item.id]: e.target.value }))} className="w-16 bg-white/10 border border-white/20 rounded px-2 py-1 text-white ml-1" min="1" />
                          ) : <span className="font-medium">{item.target_hours}h</span>}</div>
                          <div className="text-green-300">Completed: <span className="font-medium">{item.completed_hours}h</span></div>
                          <div className="text-yellow-300">Progress: <span className="font-medium">{progress}%</span></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <><button onClick={() => saveTargetHours(item.id)} className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"><Check className="w-4 h-4 text-white" /></button>
                          <button onClick={() => setEditingTarget(prev => { const newState = { ...prev }; delete newState[item.id]; return newState })} className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"><X className="w-4 h-4 text-white" /></button></>
                        ) : <button onClick={() => setEditingTarget(prev => ({ ...prev, [item.id]: String(item.target_hours) }))} className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"><Edit3 className="w-4 h-4 text-white" /></button>}
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button onClick={() => updateHours(item.id, item.completed_hours - 1)} className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"><Minus className="w-3 h-3" /> 1h</button>
                      <button onClick={() => updateHours(item.id, item.completed_hours + 1)} className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition-colors"><Plus className="w-3 h-3" /> 1h</button>
                      <button onClick={() => addPracticeSession(item.id, 25, true)} className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded transition-colors"><Timer className="w-3 h-3" /> Quick Pomodoro</button>
                      <button onClick={() => updateHours(item.id, item.target_hours)} className="flex items-center gap-1 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded transition-colors"><Check className="w-3 h-3" /> Mark Complete</button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
