// src/app/auth/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [demoMode, setDemoMode] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if we're in demo mode first
    const checkDemoMode = () => {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      return (
        !url || 
        !key || 
        url.includes('placeholder') || 
        key.includes('placeholder') ||
        url === 'https://placeholder.supabase.co' ||
        key === 'placeholder_anon_key_for_development'
      )
    }
    
    const isDemo = checkDemoMode()
    setDemoMode(isDemo)
    
    if (isDemo) {
      setMessage('🎭 Demo Mode Active: Authentication is disabled. Click "Explore Demo Mode" to see the app features.')
      return
    }

    // Only check auth status if not in demo mode
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          router.push('/roadmap')
        }
      } catch (error) {
        console.log('Auth check failed - likely in demo mode')
        setMessage('⚠️ Connection Issue: Unable to verify authentication. You can still explore the demo.')
      }
    }
    
    checkUser()
  }, [router])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    // Check if we're in demo mode first
    const checkDemoMode = () => {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      return (
        !url || 
        !key || 
        url.includes('placeholder') || 
        key.includes('placeholder') ||
        url === 'https://placeholder.supabase.co' ||
        key === 'placeholder_anon_key_for_development'
      )
    }
    
    if (checkDemoMode()) {
      setMessage('🎭 Demo Mode: Authentication is disabled. To enable full features, please set up your Supabase credentials in .env.local')
      setLoading(false)
      return
    }

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        setMessage('Check your email for the confirmation link!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        router.push('/roadmap')
      }
    } catch (error: any) {
      if (error.message?.includes('Failed to fetch') || error.message?.includes('fetch')) {
        setMessage('⚠️ Connection Error: Unable to connect to authentication service. This might be because you\'re in demo mode. Try exploring the demo instead!')
      } else {
        setMessage(error.message || 'An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back to home */}
        <Link href="/" className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">📚</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {isSignUp ? 'Join StudyHub' : 'Welcome Back'}
            </h1>
            <p className="text-blue-200">
              {isSignUp ? 'Start your study journey today' : 'Continue your learning path'}
            </p>
          </div>

          {message && (
            <div className={`p-4 rounded-lg mb-6 ${
              message.includes('error') || message.includes('Error') 
                ? 'bg-red-500/20 border border-red-500/30 text-red-200' 
                : message.includes('Demo') || message.includes('🎭')
                ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-200'
                : 'bg-green-500/20 border border-green-500/30 text-green-200'
            }`}>
              {message}
            </div>
          )}

          {demoMode ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-6 mb-6">
                  <div className="text-yellow-200 text-lg font-semibold mb-2">
                    🎭 Demo Mode Active
                  </div>
                  <p className="text-yellow-200/80 text-sm">
                    Authentication is currently disabled. You can explore all features without signing up!
                  </p>
                </div>
                <Link
                  href="/roadmap"
                  className="inline-block w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  🚀 Explore StudyHub Demo
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleAuth} className="space-y-6">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
              </button>
            </form>
          )}

          {!demoMode && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-blue-300 hover:text-blue-200 transition-colors"
              >
                {isSignUp 
                  ? 'Already have an account? Sign in' 
                  : "Don't have an account? Sign up"
                }
              </button>
            </div>
          )}

          {/* Demo Mode Access */}
          {!demoMode && (
            <div className="mt-6 text-center">
              <Link
                href="/roadmap"
                className="inline-block text-yellow-300 hover:text-yellow-200 transition-colors text-sm"
              >
                📝 Explore Demo Mode (No Account Required)
              </Link>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-white/20">
            <p className="text-center text-white/60 text-sm mb-2">
              🎓 Free forever • No credit card required
            </p>
            <p className="text-center text-white/50 text-xs">
              {demoMode 
                ? 'Demo mode active • Add Supabase credentials for full features'
                : 'Demo mode available • Full features require Supabase setup'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}