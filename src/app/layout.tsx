// src/app/layout.tsx
'use client'

import './globals.css'
import React, { useState, useEffect } from 'react'
import ErrorBoundary from '../components/ErrorBoundary'
import StudyBuddyChatbot from '../components/StudyBuddyChatbot'
import Navigation from '../components/Navigation'
import { supabase } from '../../lib/supabaseClient'
import { usePathname } from 'next/navigation'

interface LayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: LayoutProps) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()

  // Pages that don't need navigation
  const noNavPages = ['/auth']
  const showNavigation = user && !noNavPages.includes(pathname)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error('Error getting user:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          setUser(session?.user ?? null)
          setLoading(false)
        } catch (error) {
          console.error('Error in auth state change:', error)
          setLoading(false)
        }
      }
    )

    return () => {
      try {
        subscription?.unsubscribe()
      } catch (error) {
        console.error('Error unsubscribing from auth state change:', error)
      }
    }
  }, [])

  if (loading) {
    return (
      <html lang="en">
        <body className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">📚</span>
            </div>
            <div className="text-white text-xl font-semibold">Loading StudyHub...</div>
            <div className="text-gray-400 text-sm mt-2">Preparing your study environment</div>
          </div>
        </body>
      </html>
    )
  }

  return (
    <html lang="en">
      <head>
        <title>StudyHub - Your Free Study Companion</title>
        <meta name="description" content="Beat procrastination and achieve your goals with our completely free study platform. Features Pomodoro timer, progress tracking, and anti-procrastination tools." />
        <meta name="keywords" content="study planner, pomodoro timer, study goals, progress tracking, anti-procrastination, free study app, study companion" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-black text-white antialiased">
        <ErrorBoundary>
          <div className="flex min-h-screen">
            {showNavigation && (
              <Navigation user={user} />
            )}
            
            <main className={`flex-1 ${
              showNavigation ? 'lg:ml-80' : ''
            }`}>
              {children}
            </main>
          </div>
          
          {user && <StudyBuddyChatbot />}
        </ErrorBoundary>
      </body>
    </html>
  )
}
