// src/components/AuthForm.jsx
'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function AuthForm({ onSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState('sign-in') // 'sign-in' | 'sign-up'
  const [error, setError] = useState(null)
  const [info, setInfo] = useState(null)

  async function handleSubmit(e) {
    e?.preventDefault()
    setError(null)
    setInfo(null)
    if (!email) return setError('Enter an email')
    setLoading(true)
    try {
      if (mode === 'sign-in') {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        setInfo('Signed in')
        onSuccess?.(data.user ?? null)
      } else {
        // sign up
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setInfo('Check your email for confirmation (if enabled).')
        onSuccess?.(data.user ?? null)
      }
    } catch (e) {
      setError(e.message || String(e))
    } finally {
      setLoading(false)
    }
  }

  async function handleMagicLink() {
    if (!email) return setError('Enter an email to send magic link.')
    setLoading(true)
    setError(null)
    setInfo(null)
    try {
      const { data, error } = await supabase.auth.signInWithOtp({ email })
      if (error) throw error
      setInfo('Magic link sent to your email.')
    } catch (e) {
      setError(e.message || String(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div id="auth" className="max-w-md mx-auto">
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-bold">Welcome back</h2>
        <p className="small-muted">Sign in to your Prep Hub — track sessions, streaks, and progress.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {error && <div className="text-sm text-red-400 p-2 bg-[rgba(255,0,0,0.04)] rounded">{error}</div>}
        {info && <div className="text-sm text-emerald-300 p-2 bg-[rgba(0,255,0,0.02)] rounded">{info}</div>}

        <label className="block text-sm small-muted">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full rounded-md px-3 py-2 bg-transparent border border-[rgba(255,255,255,0.04)]"
          placeholder="you@example.com"
          required
        />

        <label className="block text-sm small-muted">Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full rounded-md px-3 py-2 bg-transparent border border-[rgba(255,255,255,0.04)]"
          placeholder="••••••••"
          required={mode === 'sign-in'}
        />

        <div className="flex items-center justify-between gap-3">
          <button type="submit" disabled={loading} className="flex-1 py-2 rounded-md bg-gradient-to-r from-emerald-500 to-green-400 text-black font-medium">
            {mode === 'sign-in' ? (loading ? 'Signing in...' : 'Sign in') : (loading ? 'Signing up...' : 'Create account')}
          </button>

          <button type="button" onClick={() => { setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in'); setError(null); setInfo(null) }} className="px-3 py-2 rounded-md border text-sm small-muted">
            {mode === 'sign-in' ? 'Create account' : 'Sign in'}
          </button>
        </div>

        <div className="flex items-center justify-between mt-2">
          <button type="button" onClick={handleMagicLink} className="text-sm small-muted hover:underline">Send magic link</button>
          <button type="button" onClick={() => { setEmail('demo@example.com'); setPassword('demo-pass') }} className="text-sm small-muted hover:underline">Fill demo</button>
        </div>
      </form>
    </div>
  )
}
