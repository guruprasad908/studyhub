// src/app/roadmap/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Target, 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Circle,
  TrendingUp,
  BookOpen,
  Star,
  Filter,
  Search,
  Edit2,
  Trash2
} from 'lucide-react'
import AIRoadmapGenerator from '../../components/AIRoadmapGenerator'

interface RoadmapItem {
  id: string
  title: string
  description: string
  target_hours: number
  completed_hours: number
  created_at: string
  status: 'active' | 'completed' | 'paused'
  category?: string
  priority?: 'high' | 'medium' | 'low'
  deadline?: string
}

export default function RoadmapPage() {
  const [user, setUser] = useState<any>(null)
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([])
  const [loading, setLoading] = useState(true)
  const [newItem, setNewItem] = useState({ 
    title: '', 
    description: '', 
    target_hours: 20,
    category: 'General',
    priority: 'medium' as 'high' | 'medium' | 'low',
    deadline: ''
  })
  const [showAddForm, setShowAddForm] = useState(false)
  const [viewMode, setViewMode] = useState<'manual' | 'ai'>('manual')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'created' | 'priority' | 'progress' | 'deadline'>('created')
  const router = useRouter()

  const categories = ['General', 'Programming', 'Data Science', 'Web Development', 'Design', 'Business', 'Language']
  const priorities = [
    { value: 'high', label: 'High Priority', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
    { value: 'medium', label: 'Medium Priority', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
    { value: 'low', label: 'Low Priority', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' }
  ]

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth')
        return
      }
      setUser(user)
      await fetchRoadmapItems(user.id)
    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/auth')
    }
  }

  const fetchRoadmapItems = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('roadmap_items')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setRoadmapItems(data || [])
    } catch (error) {
      console.error('Error fetching roadmap:', error)
    } finally {
      setLoading(false)
    }
  }

  const addRoadmapItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newItem.title.trim()) return

    try {
      const { data, error } = await supabase
        .from('roadmap_items')
        .insert([{
          user_id: user.id,
          title: newItem.title.trim(),
          description: newItem.description.trim(),
          target_hours: newItem.target_hours,
          completed_hours: 0,
          status: 'active'
        }])
        .select()
        .single()

      if (error) throw error
      
      setRoadmapItems([data, ...roadmapItems])
      setNewItem({ 
        title: '', 
        description: '', 
        target_hours: 20,
        category: 'General',
        priority: 'medium',
        deadline: ''
      })
      setShowAddForm(false)
    } catch (error) {
      console.error('Error adding roadmap item:', error)
    }
  }

  const updateProgress = async (itemId: string, newHours: number) => {
    try {
      const { error } = await supabase
        .from('roadmap_items')
        .update({ completed_hours: Math.max(0, newHours) })
        .eq('id', itemId)

      if (error) throw error
      
      setRoadmapItems(roadmapItems.map(item => 
        item.id === itemId ? { ...item, completed_hours: Math.max(0, newHours) } : item
      ))
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your roadmap...</div>
      </div>
    )
  }

  // Show AI Roadmap Generator if AI mode is selected
  if (viewMode === 'ai') {
    return <AIRoadmapGenerator />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold text-white">📚</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">StudyHub</h1>
              <p className="text-blue-200 text-sm">My Learning Roadmap</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link
              href="/today"
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all duration-200"
            >
              ⚡ Today's Tasks
            </Link>
            <button
              onClick={() => setViewMode(viewMode === 'manual' ? 'ai' : 'manual')}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-lg transition-all duration-200"
            >
              {viewMode === 'manual' ? '🤖 AI Roadmap' : '📝 Manual Mode'}
            </button>
            <button
              onClick={signOut}
              className="text-white/70 hover:text-white transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-white">{roadmapItems.length}</div>
            <div className="text-blue-200">Study Goals</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-green-400">
              {roadmapItems.reduce((acc, item) => acc + item.completed_hours, 0)}h
            </div>
            <div className="text-blue-200">Hours Studied</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-purple-400">
              {roadmapItems.filter(item => item.completed_hours >= item.target_hours).length}
            </div>
            <div className="text-blue-200">Goals Completed</div>
          </div>
        </div>

        {/* Add New Goal Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <span className="text-xl">+</span>
            Add New Study Goal
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Create New Study Goal</h3>
            <form onSubmit={addRoadmapItem} className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Goal Title</label>
                <input
                  type="text"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="e.g., Master JavaScript Fundamentals"
                  required
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Description</label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 h-24"
                  placeholder="What will you learn and achieve?"
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Target Hours</label>
                <input
                  type="number"
                  value={newItem.target_hours}
                  onChange={(e) => setNewItem({ ...newItem, target_hours: parseInt(e.target.value) || 20 })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  min="1"
                  max="1000"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200"
                >
                  Create Goal
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-500/50 hover:bg-gray-500/70 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Roadmap Items */}
        <div className="space-y-6">
          {roadmapItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-white mb-2">Start Your Learning Journey</h3>
              <p className="text-blue-200 mb-6">Create your first study goal to begin tracking your progress!</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Create Your First Goal
              </button>
            </div>
          ) : (
            roadmapItems.map((item) => {
              const progress = (item.completed_hours / item.target_hours) * 100
              const isCompleted = item.completed_hours >= item.target_hours
              
              return (
                <div
                  key={item.id}
                  className={`bg-white/10 backdrop-blur-md rounded-xl p-6 border transition-all duration-200 hover:bg-white/15 ${
                    isCompleted ? 'border-green-400/50 bg-green-500/10' : 'border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className={`text-xl font-bold mb-2 ${isCompleted ? 'text-green-300' : 'text-white'}`}>
                        {isCompleted && '✅ '}{item.title}
                      </h3>
                      {item.description && (
                        <p className="text-blue-200 mb-4">{item.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/80">Progress</span>
                      <span className="text-white font-medium">
                        {item.completed_hours}h / {item.target_hours}h ({Math.round(progress)}%)
                      </span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${
                          isCompleted ? 'bg-green-400' : 'bg-gradient-to-r from-blue-400 to-purple-400'
                        }`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => updateProgress(item.id, item.completed_hours - 1)}
                      className="px-3 py-1 bg-red-500/50 hover:bg-red-500/70 text-white rounded-lg transition-colors"
                    >
                      -1h
                    </button>
                    <button
                      onClick={() => updateProgress(item.id, item.completed_hours + 1)}
                      className="px-3 py-1 bg-green-500/50 hover:bg-green-500/70 text-white rounded-lg transition-colors"
                    >
                      +1h
                    </button>
                    <div className="ml-auto text-sm text-white/60">
                      Created {new Date(item.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}