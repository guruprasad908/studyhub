// src/components/PomodoroTimer.jsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function PomodoroTimer({ user, item, onSessionComplete, minutes = 25 }) {
  const [running, setRunning] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60)

  useEffect(() => {
    setSecondsLeft(minutes * 60)
    setRunning(false)
  }, [minutes, item?.id])

  useEffect(() => {
    if (!running) return
    if (secondsLeft <= 0) {
      setRunning(false)
      logSession()
      return
    }
    const id = setInterval(() => setSecondsLeft(s => s - 1), 1000)
    return () => clearInterval(id)
  }, [running, secondsLeft])

  function startTimer() {
    if (!item) {
      alert('Select a task first.')
      return
    }
    setSecondsLeft(minutes * 60)
    setRunning(true)
  }

  function stopTimer() {
    setRunning(false)
  }

  async function logSession() {
    if (!user || !item) return
    const payload = {
      user_id: user.id,
      item_id: item.id,
      started_at: new Date(Date.now() - minutes * 60000).toISOString(),
      ended_at: new Date().toISOString(),
      duration_minutes: minutes,
      pomodoro: true
    }
    const { error } = await supabase.from('practice_sessions').insert([payload])
    if (error) {
      console.error('Pomodoro insert error', error)
      alert('Failed to log session')
      return
    }
    const newCompleted = (item.completed_hours ?? 0) + 1
    await supabase.from('roadmap_items')
      .update({ completed_hours: newCompleted })
      .eq('id', item.id)

    if (onSessionComplete) onSessionComplete()
    alert(`Pomodoro finished for ${item.title}!`)
  }

  const minutesLeft = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60

  return (
    <div style={{ padding: 12, border: '1px solid #ccc', borderRadius: 8 }}>
      <h4>Pomodoro Timer</h4>
      <div><strong>Task:</strong> {item ? item.title : <em>none</em>}</div>

      <div style={{ fontSize: 28, margin: '12px 0', fontFamily: 'monospace' }}>
        {minutesLeft}:{String(seconds).padStart(2, '0')}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        {!running ? (
          <button onClick={startTimer}>Start</button>
        ) : (
          <button onClick={stopTimer}>Stop</button>
        )}
        <button onClick={() => { setSecondsLeft(minutes * 60); setRunning(false) }}>Reset</button>
      </div>
    </div>
  )
}
