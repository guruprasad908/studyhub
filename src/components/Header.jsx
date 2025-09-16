// src/components/Header.jsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function Header({ onAuthChange }) {
  const [user, setUser] = useState(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let mounted = true
    supabase.auth.getUser().then(r => {
      if (!mounted) return
      setUser(r.data.user ?? null)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      onAuthChange?.(u)
    })
    return () => { mounted = false; sub?.subscription?.unsubscribe?.() }
  }, [onAuthChange])

  async function handleSignOut() {
    await supabase.auth.signOut()
    setUser(null)
    onAuthChange?.(null)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/20 bg-white/10 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg">
            PH
          </div>
          <div>
            <div className="font-bold text-xl text-white">PrepHub</div>
            <div className="text-xs text-blue-200">Professional Preparation</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a className="text-white/80 hover:text-white font-medium transition-colors duration-200" href="#features">
            Features
          </a>
          <a className="text-white/80 hover:text-white font-medium transition-colors duration-200" href="#pricing">
            Pricing
          </a>
          <a className="text-white/80 hover:text-white font-medium transition-colors duration-200" href="#dashboard">
            Dashboard
          </a>
          <a className="text-white/80 hover:text-white font-medium transition-colors duration-200" href="#auth-area">
            Resources
          </a>
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setOpen(s => !s)}
                className="flex items-center gap-3 rounded-xl px-4 py-2 bg-white/10 border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-sm font-semibold text-white">
                  {user.email?.charAt(0)?.toUpperCase() ?? 'U'}
                </div>
                <div className="hidden sm:block text-white font-medium">
                  {user.email?.split?.('@')?.[0]}
                </div>
                <div className="text-white/60">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl z-50">
                  <div className="p-4">
                    <div className="text-xs text-blue-200 uppercase tracking-wide mb-2">Account</div>
                    <div className="text-white font-medium mb-1">{user.email}</div>
                    <div className="text-white/60 text-sm mb-4">Free Plan</div>
                    
                    <div className="space-y-2">
                      <button className="w-full text-left px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-200">
                        Profile Settings
                      </button>
                      <button className="w-full text-left px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-200">
                        Upgrade Plan
                      </button>
                      <hr className="border-white/20 my-2" />
                      <button 
                        onClick={() => { handleSignOut(); setOpen(false) }}
                        className="w-full text-left px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors duration-200"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <a 
                href="#auth-area" 
                className="text-white/80 hover:text-white font-medium transition-colors duration-200"
              >
                Sign In
              </a>
              <a 
                href="#auth-area" 
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Get Started
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
