'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function AuthButton() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(r => setUser(r.data.user ?? null))
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => sub?.subscription?.unsubscribe?.()
  }, [])

  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({
      email: 'demo@example.com',
      password: 'password',
    })
    if (error) alert('Sign-in failed: ' + error.message)
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
  }

  if (!user) {
    return <button onClick={signIn}>Sign in (demo@example.com)</button>
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <span>{user.email}</span>
      <button onClick={() => router.push('/dashboard')}>Dashboard</button>
      <button onClick={signOut}>Sign out</button>
    </div>
  )
}
