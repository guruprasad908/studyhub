// src/components/DashboardClient.jsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import PomodoroTimer from './PomodoroTimer'
import WeeklyChart from './WeeklyChart'
import TaskPieChart from './TaskPieChart'
import Card from './Card'

export default function DashboardClient() {
  const [user, setUser] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [editingTarget, setEditingTarget] = useState({})
  const [streaks, setStreaks] = useState({})
  const [selectedItemId, setSelectedItemId] = useState('')
  const [pomMinutes, setPomMinutes] = useState(25)

  // sessions and UI toggles
  const [sessions, setSessions] = useState({})      // per-item recent sessions
  const [showSessions, setShowSessions] = useState({})

  // weekly summary state
  const [weeklySummary, setWeeklySummary] = useState({
    totalHours: 0,
    totalPomodoros: 0,
    daysStudied: 0,
    consistencyPct: 0,
    currentStreakDays: 0,
    hoursByDay: [],
    hoursByTask: []
  })
  const DAYS_WINDOW = 7

  useEffect(() => {
    let mounted = true
    supabase.auth.getUser().then(r => {
      const u = r.data.user
      if (mounted) setUser(u)
      if (u) fullReload(u.id)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) fullReload(u?.id)
      else {
        setItems([])
        setStreaks({})
        setSessions({})
        setWeeklySummary({
          totalHours: 0, totalPomodoros: 0, daysStudied: 0,
          consistencyPct: 0, currentStreakDays: 0, hoursByDay: [], hoursByTask: []
        })
      }
    })
    return () => { mounted = false; sub?.subscription?.unsubscribe?.() }
  }, [])

  // ---------- fetch & helpers ----------

  async function fullReload(userId) {
    await fetchItems(userId)
    await fetchWeeklySummary(userId)
  }

  // fetchWeeklySummary builds hoursByDay and hoursByTask for charts
  async function fetchWeeklySummary(userId) {
    if (!userId) return
    try {
      const since = new Date()
      since.setDate(since.getDate() - (DAYS_WINDOW - 1))
      const sinceISO = since.toISOString()

      // fetch practice sessions in last 7 days (include item_id)
      const { data: rows = [], error } = await supabase
        .from('practice_sessions')
        .select('id, item_id, created_at, started_at, ended_at, duration_minutes, pomodoro')
        .eq('user_id', userId)
        .gte('created_at', sinceISO)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('fetchWeeklySummary sessions error', error)
        setWeeklySummary(prev => ({ ...prev, totalHours: 0, hoursByDay: [], hoursByTask: [] }))
        return
      }

      // build day buckets (oldest -> newest)
      const dayBuckets = []
      const dayKeys = []
      const today = new Date()
      for (let i = DAYS_WINDOW - 1; i >= 0; i--) {
        const d = new Date()
        d.setDate(today.getDate() - i)
        const iso = d.toISOString().slice(0,10)
        dayKeys.push(iso)
        dayBuckets.push({
          iso,
          label: d.toLocaleDateString(undefined, { weekday: 'short', month: 'numeric', day: 'numeric' }),
          minutes: 0
        })
      }

      let totalMinutes = 0
      let totalPomodoros = 0
      const daysSet = new Set()
      const taskBuckets = {} // item_id -> minutes

      rows.forEach(r => {
        const minutes = Number(r.duration_minutes ?? 0)
        totalMinutes += minutes
        if (r.pomodoro) totalPomodoros += 1

        const created = r.created_at ?? r.started_at ?? r.ended_at
        if (created) {
          const dayIso = new Date(created).toISOString().slice(0,10)
          daysSet.add(dayIso)
          const idx = dayKeys.indexOf(dayIso)
          if (idx >= 0) dayBuckets[idx].minutes += minutes
        }

        if (r.item_id) {
          taskBuckets[r.item_id] = (taskBuckets[r.item_id] || 0) + minutes
        }
      })

      // fetch titles for tasks (if present)
      const taskData = []
      if (Object.keys(taskBuckets).length > 0) {
        try {
          const ids = Object.keys(taskBuckets)
          const { data: taskRows } = await supabase
            .from('roadmap_items')
            .select('id, title')
            .in('id', ids)
          const titleMap = {}
          (taskRows || []).forEach(t => { titleMap[t.id] = t.title })
          for (const [itemId, mins] of Object.entries(taskBuckets)) {
            const name = titleMap[itemId] ?? `Task ${itemId.slice(0,6)}`
            taskData.push({ name, value: +(mins/60).toFixed(2) })
          }
        } catch (e) {
          console.warn('fetch task titles failed, falling back to ids', e)
          for (const [itemId, mins] of Object.entries(taskBuckets)) {
            taskData.push({ name: `Task ${itemId.slice(0,6)}`, value: +(mins/60).toFixed(2) })
          }
        }
      }

      const hoursByDay = dayBuckets.map(b => ({ label: b.label, hours: +(b.minutes/60).toFixed(2) }))
      const totalHours = +(totalMinutes / 60).toFixed(1)
      const daysStudied = daysSet.size
      const consistencyPct = Math.round((daysStudied / DAYS_WINDOW) * 100)

      // compute current consecutive-day streak up to today within the window
      let streak = 0
      for (let i = 0; i < DAYS_WINDOW; i++) {
        const d = new Date()
        d.setDate(today.getDate() - i)
        const dayStr = d.toISOString().slice(0,10)
        if (daysSet.has(dayStr)) streak += 1
        else break
      }

      setWeeklySummary({
        totalHours,
        totalPomodoros,
        daysStudied,
        consistencyPct,
        currentStreakDays: streak,
        hoursByDay,
        hoursByTask: taskData
      })
    } catch (e) {
      console.error('fetchWeeklySummary exception', e)
      setWeeklySummary({
        totalHours:0,totalPomodoros:0,daysStudied:0,consistencyPct:0,currentStreakDays:0,
        hoursByDay: [], hoursByTask: []
      })
    }
  }

  async function fetchStreaks(itemList) {
    const newStreaks = {}
    const since = new Date()
    since.setDate(since.getDate() - 6)
    const sinceISO = since.toISOString()

    for (const it of itemList) {
      try {
        const { data: rows } = await supabase
          .from('practice_sessions')
          .select('created_at')
          .eq('item_id', it.id)
          .gte('created_at', sinceISO)

        if (!rows || rows.length === 0) {
          newStreaks[it.id] = 0
          continue
        }
        const daysSet = new Set(rows.map(r => new Date(r.created_at).toISOString().slice(0,10)))
        newStreaks[it.id] = daysSet.size
      } catch (e) {
        console.error('fetchStreaks error', e)
        newStreaks[it.id] = 0
      }
    }
    setStreaks(prev => ({ ...prev, ...newStreaks }))
  }

  async function fetchSessionsForItem(itemId, limit = 10) {
    if (!itemId) return
    try {
      const { data, error } = await supabase
        .from('practice_sessions')
        .select('id, started_at, ended_at, duration_minutes, pomodoro, created_at')
        .eq('item_id', itemId)
        .order('created_at', { ascending: false })
        .limit(limit)
      if (error) {
        console.error('fetchSessionsForItem error', itemId, error)
        setSessions(prev => ({ ...prev, [itemId]: [] }))
        return
      }
      setSessions(prev => ({ ...prev, [itemId]: data || [] }))
    } catch (e) {
      console.error('fetchSessionsForItem exception', e)
      setSessions(prev => ({ ...prev, [itemId]: [] }))
    }
  }

  async function fetchItems(userId) {
    if (!userId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('roadmap_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) {
      console.error('fetchItems error', error)
      setItems([])
      setLoading(false)
      return
    }
    setItems(data || [])
    setLoading(false)
    fetchStreaks(data || [])
    ;(data || []).forEach(it => fetchSessionsForItem(it.id))
  }

  // ---------- actions ----------

  async function addItem(e) {
    e?.preventDefault()
    if (!title || !user) return
    const payload = { user_id: user.id, title, target_hours: 1, completed_hours: 0 }
    const { data, error } = await supabase.from('roadmap_items').insert([payload]).select().single()
    if (error) {
      console.error('insert error', error)
      alert('Insert failed. Check console.')
      return
    }
    setTitle('')
    setItems(prev => [data, ...prev])
    setStreaks(prev => ({ ...prev, [data.id]: 0 }))
    setSessions(prev => ({ ...prev, [data.id]: [] }))
    // refresh weekly summary
    fetchWeeklySummary(user.id)
  }

  async function updateHours(itemId, newValue) {
    setItems(prev => prev.map(it => it.id === itemId ? { ...it, completed_hours: newValue } : it))
    const { data, error } = await supabase
      .from('roadmap_items')
      .update({ completed_hours: newValue })
      .eq('id', itemId)
      .select()
      .single()
    if (error) {
      console.error('updateHours error', error)
      const u = user?.id
      if (u) fetchItems(u)
    } else {
      setItems(prev => prev.map(it => it.id === itemId ? data : it))
      fetchWeeklySummary(user?.id)
    }
  }

  async function changeHours(item, delta) {
    const current = Number(item.completed_hours ?? 0)
    let next = current + delta
    if (next < 0) next = 0
    await updateHours(item.id, next)
  }

  async function setTargetHours(itemId, rawValue) {
    setEditingTarget(prev => ({ ...prev, [itemId]: rawValue }))
  }

  async function saveTargetHours(item) {
    const raw = editingTarget[item.id]
    if (raw == null) return
    const val = Number(raw)
    if (isNaN(val) || val < 0) {
      alert('Enter a valid number')
      return
    }
    setItems(prev => prev.map(it => it.id === item.id ? { ...it, target_hours: val } : it))
    setEditingTarget(prev => {
      const copy = { ...prev }
      delete copy[item.id]
      return copy
    })
    const { data, error } = await supabase
      .from('roadmap_items')
      .update({ target_hours: val })
      .eq('id', item.id)
      .select()
      .single()
    if (error) {
      console.error('saveTargetHours error', error)
      const u = user?.id
      if (u) fetchItems(u)
    } else {
      setItems(prev => prev.map(it => it.id === item.id ? data : it))
    }
  }

  async function addPracticeSession(itemId, opts = {}) {
    const start = new Date().toISOString()
    const end = new Date().toISOString()
    const minutes = opts.minutes ?? 25
    const payload = {
      user_id: user.id,
      item_id: itemId,
      started_at: start,
      ended_at: end,
      duration_minutes: minutes,
      pomodoro: !!opts.pomodoro
    }
    const { error } = await supabase.from('practice_sessions').insert([payload])
    if (error) {
      console.error('addPracticeSession error', error)
      return null
    }
    fetchStreaks(items.filter(it => it.id === itemId))
    fetchSessionsForItem(itemId)
    fetchWeeklySummary(user.id)
    return true
  }

  async function markDoneAndLog(item) {
    const targetVal = Number(item.target_hours ?? 0)
    if (targetVal <= 0) {
      alert('Target hours is zero or not set.')
      return
    }
    await updateHours(item.id, targetVal)
    const payload = {
      user_id: user.id,
      item_id: item.id,
      started_at: new Date().toISOString(),
      ended_at: new Date().toISOString(),
      duration_minutes: targetVal * 60,
      pomodoro: false
    }
    await supabase.from('practice_sessions').insert([payload])
    if (user?.id) {
      fetchItems(user.id)
      fetchSessionsForItem(item.id)
      fetchWeeklySummary(user.id)
    }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    setItems([])
    setSessions({})
    window.location.href = '/'
  }

  function percentComplete(item) {
    const target = Number(item.target_hours ?? 0)
    const completed = Number(item.completed_hours ?? 0)
    if (!target || target <= 0) return null
    return Math.min(100, Math.round((completed / target) * 100))
  }

  function toggleShowSessions(itemId) {
    setShowSessions(prev => ({ ...prev, [itemId]: !prev[itemId] }))
    if (!showSessions[itemId] && (!sessions[itemId] || sessions[itemId].length === 0)) {
      fetchSessionsForItem(itemId)
    }
  }

  // ---------- UI render ----------
  if (!user) {
    return <p className="p-4">You must be signed in to use the dashboard.</p>
  }

  return (
    <section className="mt-4 px-4">
      {/* Weekly summary card */}
      <div className="w-full mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* left: summary + charts */}
          <Card className="col-span-2">
            <div className="flex items-start justify-between">
              <div>
                <div className="small-muted">This week (last 7 days)</div>
                <div className="mt-2 flex items-baseline gap-3">
                  <div className="text-3xl font-extrabold leading-none text-white">{weeklySummary.totalHours}</div>
                  <div className="text-sm small-muted">hours</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm small-muted">Consistency</div>
                <div className="text-lg font-semibold text-white">{weeklySummary.consistencyPct}%</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm small-muted">Pomodoros</div>
                <div className="font-semibold text-white">{weeklySummary.totalPomodoros}</div>
              </div>
              <div>
                <div className="text-sm small-muted">Days studied</div>
                <div className="font-semibold text-white">{weeklySummary.daysStudied}/7</div>
              </div>
              <div>
                <div className="text-sm small-muted">Current streak</div>
                <div className="font-semibold text-white">{weeklySummary.currentStreakDays}d</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="chart-bg rounded-lg">
                <WeeklyChart data={weeklySummary.hoursByDay ?? []} />
              </div>

              <div className="chart-bg rounded-lg">
                <TaskPieChart data={weeklySummary.hoursByTask ?? []} />
              </div>
            </div>
          </Card>

          {/* right quick actions */}
          <Card className="flex flex-col justify-between items-stretch">
            <div>
              <div className="small-muted">Quick actions</div>
              <div className="mt-3 flex flex-col gap-3">
                <button
                  className="w-full py-2 rounded-md bg-gradient-to-r from-emerald-500 to-green-400 text-black font-medium"
                  onClick={() => {
                    if (!selectedItemId) return alert('Select a task first.')
                    addPracticeSession(selectedItemId, { minutes: pomMinutes, pomodoro: true })
                    fetchWeeklySummary(user?.id)
                  }}
                >
                  Log quick Pomodoro
                </button>
                <button
                  className="w-full py-2 rounded-md border border-gray-700 text-sm small-muted"
                  onClick={() => { fetchItems(user.id); fetchWeeklySummary(user.id) }}
                >
                  Refresh
                </button>
              </div>
            </div>

            <div className="mt-4 text-xs small-muted">
              Tip: use short timers (5m) while testing. Real sessions update the charts automatically.
            </div>
          </Card>
        </div>
      </div>

      {/* main header and controls */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <strong className="text-lg">{user.email}</strong>
        </div>
        <div className="flex items-center gap-3">
          <button className="py-1 px-3 rounded-md border" onClick={signOut}>Sign out</button>
        </div>
      </div>

      {/* add item */}
      <form onSubmit={addItem} className="flex gap-3 mb-6">
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="New roadmap item"
          className="flex-1 rounded-md px-3 py-2 bg-transparent border border-gray-700"
        />
        <button type="submit" className="px-4 py-2 rounded-md bg-sky-600">Add</button>
      </form>

      {/* items list */}
      <div>
        <h3 className="mb-3">Your roadmap items</h3>
        {loading ? <p>Loading…</p> : items.length === 0 ? <p>No items yet.</p> : (
          <ul className="space-y-4">
            {items.map(it => {
              const pct = percentComplete(it)
              const streak = streaks[it.id] ?? 0
              const itemSessions = sessions[it.id] ?? []
              const showing = !!showSessions[it.id]
              return (
                <li key={it.id} className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.03)]">
                  <div className="flex justify-between">
                    <div>
                      <strong>{it.title}</strong>
                      <div className="text-sm small-muted mt-1">
                        Target hrs:{' '}
                        {editingTarget[it.id] != null ? (
                          <input
                            value={editingTarget[it.id]}
                            onChange={e => setTargetHours(it.id, e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') saveTargetHours(it) }}
                            className="w-16 rounded px-2 py-1 bg-transparent border border-gray-700"
                          />
                        ) : (
                          <span>{it.target_hours}</span>
                        )}
                        {' '}• Completed: {it.completed_hours ?? 0}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">{pct === null ? 'Progress: N/A' : `${pct}%`}</div>
                      <div className="text-sm small-muted">Streak: {streak}</div>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 items-center">
                    <button className="px-2 py-1 rounded border" onClick={() => changeHours(it, -1)}>-1 hr</button>
                    <button className="px-2 py-1 rounded border" onClick={() => changeHours(it, 1)}>+1 hr</button>
                    <button className="px-2 py-1 rounded border" onClick={() => saveTargetHours(it)}>Save target</button>
                    <button
                      className="px-2 py-1 rounded border"
                      onClick={() => {
                        if (editingTarget[it.id] == null) {
                          setEditingTarget(prev => ({ ...prev, [it.id]: String(it.target_hours ?? 0) }))
                        } else {
                          setEditingTarget(prev => { const c = {...prev}; delete c[it.id]; return c })
                        }
                      }}
                    >
                      {editingTarget[it.id] == null ? 'Edit target' : 'Cancel'}
                    </button>
                    <button className="px-2 py-1 rounded bg-emerald-600 text-black" onClick={() => markDoneAndLog(it)}>Mark Done & Log</button>

                    <button className="px-2 py-1 rounded border" onClick={() => toggleShowSessions(it.id)}>
                      {showing ? 'Hide sessions' : `Show sessions (${itemSessions.length})`}
                    </button>

                    {/* quick select for Pomodoro */}
                    <div className="ml-auto flex items-center gap-2">
                      <select value={selectedItemId} onChange={(e) => setSelectedItemId(e.target.value)} className="rounded border px-2 py-1 bg-transparent">
                        <option value="">— select task —</option>
                        {items.map(x => <option key={x.id} value={x.id}>{x.title}</option>)}
                      </select>
                      <select value={pomMinutes} onChange={(e) => setPomMinutes(Number(e.target.value))} className="rounded border px-2 py-1 bg-transparent">
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                      </select>
                    </div>
                  </div>

                  {showing && (
                    <div className="mt-3 p-3 bg-[rgba(255,255,255,0.02)] rounded">
                      {itemSessions.length === 0 ? (
                        <div className="text-sm small-muted">No recent sessions.</div>
                      ) : (
                        <ul className="space-y-2">
                          {itemSessions.map(s => (
                            <li key={s.id} className="text-sm">
                              <strong>{s.duration_minutes} min</strong>
                              {' '}• {s.pomodoro ? 'Pomodoro' : 'Manual'} • {new Date(s.created_at ?? s.started_at ?? s.ended_at).toLocaleString()}
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="mt-3 flex gap-2">
                        <button className="px-2 py-1 rounded border" onClick={() => fetchSessionsForItem(it.id)}>Refresh</button>
                        <button className="px-2 py-1 rounded border" onClick={async () => {
                          await addPracticeSession(it.id, { minutes: 5, pomodoro: false })
                          fetchSessionsForItem(it.id)
                          fetchItems(user.id)
                          fetchWeeklySummary(user.id)
                        }}>Add test session (5m)</button>
                      </div>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* Pomodoro Section */}
      <div className="mt-8">
        <h3 className="mb-3">Pomodoro</h3>
        <div className="mb-4 flex gap-3 items-center">
          <label className="small-muted">Task:</label>
          <select
            value={selectedItemId}
            onChange={(e) => setSelectedItemId(e.target.value)}
            className="rounded border px-2 py-1 bg-transparent"
            style={{ minWidth: 200 }}
          >
            <option value="">— select task —</option>
            {items.map(it => <option key={it.id} value={it.id}>{it.title}</option>)}
          </select>

          <label className="small-muted">Minutes:</label>
          <select value={pomMinutes} onChange={(e) => setPomMinutes(Number(e.target.value))} className="rounded border px-2 py-1 bg-transparent">
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>

        <PomodoroTimer
          user={user}
          item={items.find(it => it.id === selectedItemId) ?? null}
          minutes={pomMinutes}
          onSessionComplete={() => {
            fetchItems(user.id)
            if (selectedItemId) fetchSessionsForItem(selectedItemId)
            fetchWeeklySummary(user.id)
          }}
        />
      </div>
    </section>
  )
}
