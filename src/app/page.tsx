'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { Target, BookOpen, Clock, LogOut, Zap, TrendingUp, Brain, Star } from 'lucide-react'

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">📚</span>
          </div>
          <div className="text-white text-xl font-semibold">Loading StudyHub...</div>
          <div className="text-gray-400 text-sm mt-2">Preparing your study environment</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-lg p-8">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-700 rounded-lg flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl font-bold text-white">📚</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-300 mb-3">StudyHub</h1>
            <p className="text-gray-300 text-lg">Your completely free AI-powered study companion</p>
          </div>
          
          {/* Features Highlight */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
            <h3 className="text-blue-200 font-semibold mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              ✨ 100% Free Study Platform
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3">
                <Brain className="w-4 h-4 text-purple-400" />
                <span className="text-gray-300 text-sm">AI-powered study roadmaps & coaching</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-green-400" />
                <span className="text-gray-300 text-sm">Smart Pomodoro timer with adaptive breaks</span>
              </div>
              <div className="flex items-center gap-3">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300 text-sm">Progress tracking & analytics</span>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-orange-400" />
                <span className="text-gray-300 text-sm">Anti-procrastination features</span>
              </div>
              <div className="flex items-center gap-3">
                <Target className="w-4 h-4 text-pink-400" />
                <span className="text-gray-300 text-sm">Daily task management & goals</span>
              </div>
            </div>
            
            {process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder') && (
              <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <div className="flex items-center gap-2 text-amber-200 text-sm">
                  <span className="animate-spin">🔄</span>
                  <span className="font-medium">Demo Mode Active</span>
                </div>
                <p className="text-amber-300 text-xs mt-1">UI fully functional, data won't persist</p>
              </div>
            )}
          </div>

          <Link
            href="/auth"
            className="w-full gradient-button py-4 px-6 rounded-xl text-center text-lg font-semibold flex items-center justify-center gap-3 group"
          >
            <span>Get Started - Completely Free!</span>
            <Zap className="w-5 h-5 group-hover:animate-pulse" />
          </Link>
          
          <div className="text-center mt-4">
            <p className="text-gray-400 text-xs">No premium features • Everything is free forever</p>
          </div>
        </div>
      </div>
    )
  }

  // User is logged in - show clean navigation dashboard
  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-6xl mx-auto">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-white">📚</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-300">StudyHub</h1>
              <p className="text-gray-300 text-lg">Welcome back, <span className="text-purple-300 font-semibold">{user.email?.split('@')[0]}</span>!</p>
            </div>
          </div>
          
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-6 py-3 text-white hover:text-red-300 transition-colors group"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Enhanced Welcome Message */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to <span className="text-gray-300">focus</span> and achieve your goals?
          </h2>
          <p className="text-gray-300 text-xl max-w-2xl mx-auto leading-relaxed">
            Choose your study environment - designed with AI to help you beat procrastination and maximize productivity
          </p>
        </div>

        {/* Enhanced Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          <Link
            href="/roadmap"
            className="group glass-card p-8 hover:bg-white/[0.06] transition-all duration-300"
          >
            <div className="flex items-center gap-6 mb-6">
              <div className="p-4 bg-blue-800 rounded-lg group-hover:bg-blue-700 transition-colors">
                <Target className="w-8 h-8 text-blue-400" />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-bold text-white group-hover:text-blue-200 transition-colors">Study Roadmap</h2>
                <p className="text-blue-300 text-lg">Plan your learning journey</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Create AI-powered, personalized study plans and set strategic long-term goals for your academic and professional success.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 rounded-full border border-yellow-500/30">
              <Brain className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-300 text-sm font-semibold">🆕 AI-Powered Roadmap Generator</span>
            </div>
          </Link>

          <Link
            href="/today"
            className="group glass-card p-8 hover:bg-white/[0.06] transition-all duration-300"
          >
            <div className="flex items-center gap-6 mb-6">
              <div className="p-4 bg-green-800 rounded-lg group-hover:bg-green-700 transition-colors">
                <Clock className="w-8 h-8 text-green-400" />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-bold text-white group-hover:text-green-200 transition-colors">Today's Focus</h2>
                <p className="text-green-300 text-lg">Beat procrastination now</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Focus on daily tasks with our Smart Pomodoro AI Coach, adaptive timing, and powerful anti-procrastination tools.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full border border-green-500/30">
              <Zap className="w-4 h-4 text-green-400" />
              <span className="text-green-300 text-sm font-semibold">Smart AI Coach Included</span>
            </div>
          </Link>

          <Link
            href="/dashboard"
            className="group bg-gray-900 border border-gray-800 rounded-lg p-8 hover:bg-gray-800 transition-colors duration-200"
          >
            <div className="flex items-center gap-6 mb-6">
              <div className="p-4 bg-purple-800 rounded-lg group-hover:bg-purple-700 transition-colors">
                <BookOpen className="w-8 h-8 text-purple-400" />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-bold text-white group-hover:text-purple-200 transition-colors">Study Dashboard</h2>
                <p className="text-purple-300 text-lg">Track your progress</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Monitor your study sessions with detailed analytics, charts, and insights to see your improvement over time.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm font-semibold">Advanced Analytics</span>
            </div>
          </Link>

          {/* AI Study Buddy Highlight Card */}
          <Link
            href="/roadmap"
            className="group bg-gray-900 border border-gray-800 rounded-lg p-8 bg-purple-900/20 hover:bg-gray-800 border-purple-700 transition-colors duration-200 relative overflow-hidden"
          >
            <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-600 text-white text-xs font-bold rounded">
              🆕 NEW
            </div>
            <div className="flex items-center gap-6 mb-6">
              <div className="p-4 bg-purple-700 rounded-lg">
                <span className="text-3xl">🤖</span>
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-bold text-white group-hover:text-purple-200 transition-colors">AI Study Buddy</h2>
                <p className="text-purple-300 text-lg">Your personal AI coach</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Get AI-generated study roadmaps, daily tasks, practice questions, and real-time coaching powered by advanced AI models!
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">📊 Data Science</span>
              <span className="px-3 py-1 bg-green-500/20 text-green-300 text-xs rounded-full border border-green-500/30">🌐 Web Dev</span>
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30">🤖 ML/AI</span>
              <span className="px-3 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full border border-orange-500/30">🐍 Python</span>
            </div>
          </Link>
        </div>

        {/* Enhanced Anti-Procrastination Features */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-300 mb-4">🎯 Anti-Procrastination Arsenal</h3>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">Scientifically-designed features to keep you focused and productive</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center hover:bg-gray-750 transition-colors">
              <div className="w-12 h-12 bg-green-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-green-400" />
              </div>
              <h4 className="text-white font-semibold mb-2">Smart Pomodoro</h4>
              <p className="text-gray-400 text-sm">AI-adaptive focus sessions with personalized break timing</p>
            </div>
            
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center hover:bg-gray-750 transition-colors">
              <div className="w-12 h-12 bg-blue-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="text-white font-semibold mb-2">AI Motivation</h4>
              <p className="text-gray-400 text-sm">Personalized quotes, tips, and real-time coaching</p>
            </div>
            
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center hover:bg-gray-750 transition-colors">
              <div className="w-12 h-12 bg-purple-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              <h4 className="text-white font-semibold mb-2">Goal Chunking</h4>
              <p className="text-gray-400 text-sm">Break overwhelming tasks into achievable milestones</p>
            </div>
            
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center hover:bg-gray-750 transition-colors">
              <div className="w-12 h-12 bg-pink-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-pink-400" />
              </div>
              <h4 className="text-white font-semibold mb-2">Progress Tracking</h4>
              <p className="text-gray-400 text-sm">Visual progress charts to maintain momentum</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
