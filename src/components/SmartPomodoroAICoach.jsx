// Smart Pomodoro AI Coach - Enhanced timer with AI-powered insights and coaching
'use client'

import { useState, useEffect, useRef } from 'react'
import { aiRoadmapService } from '../lib/aiService'

export default function SmartPomodoroAICoach({ 
  user, 
  currentTask, 
  onSessionComplete, 
  defaultMinutes = 25 
}) {
  // Timer states
  const [isRunning, setIsRunning] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(defaultMinutes * 60)
  const [sessionType, setSessionType] = useState('focus') // focus, short-break, long-break
  const [sessionCount, setSessionCount] = useState(0)
  const [customMinutes, setCustomMinutes] = useState(defaultMinutes)
  
  // AI Coach states
  const [aiCoachingEnabled, setAiCoachingEnabled] = useState(true)
  const [focusScore, setFocusScore] = useState(100) // Simulated focus tracking
  const [aiInsights, setAiInsights] = useState([])
  const [currentCoaching, setCurrentCoaching] = useState('')
  const [sessionHistory, setSessionHistory] = useState([])
  const [adaptiveMode, setAdaptiveMode] = useState(true)
  
  // Pattern tracking
  const [dailyPatterns, setDailyPatterns] = useState({
    bestFocusHours: [],
    averageSessionLength: 25,
    completionRate: 0,
    preferredBreakType: 'active'
  })

  const intervalRef = useRef(null)
  const startTimeRef = useRef(null)

  // Load session history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('pomodoro_session_history')
    if (saved) {
      const history = JSON.parse(saved)
      setSessionHistory(history)
      analyzePatterns(history)
    }
  }, [])

  // Debug: Log when currentTask changes
  useEffect(() => {
    console.log('SmartPomodoro currentTask changed:', currentTask)
  }, [currentTask])

  // Timer logic
  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      
      if (secondsLeft <= 0 && isRunning) {
        handleSessionComplete()
      }
      return
    }

    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          setIsRunning(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, secondsLeft])

  // AI Coaching during session
  useEffect(() => {
    if (isRunning && aiCoachingEnabled) {
      const coachingInterval = setInterval(() => {
        provideRealTimeCoaching()
      }, 300000) // Every 5 minutes

      return () => clearInterval(coachingInterval)
    }
  }, [isRunning, aiCoachingEnabled])

  const analyzePatterns = (history) => {
    if (history.length === 0) return

    // Analyze focus patterns
    const hourlyData = {}
    const completedSessions = history.filter(s => s.completed)
    
    completedSessions.forEach(session => {
      const hour = new Date(session.startTime).getHours()
      hourlyData[hour] = (hourlyData[hour] || 0) + 1
    })

    const bestHours = Object.entries(hourlyData)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => parseInt(hour))

    const avgLength = completedSessions.reduce((sum, s) => sum + s.duration, 0) / completedSessions.length || 25
    const completionRate = (completedSessions.length / history.length) * 100

    setDailyPatterns({
      bestFocusHours: bestHours,
      averageSessionLength: Math.round(avgLength),
      completionRate: Math.round(completionRate),
      preferredBreakType: 'active' // Could be derived from break session data
    })
  }

  const startTimer = async () => {
    if (!currentTask && sessionType === 'focus') {
      alert('Please select a task to focus on first!')
      return
    }

    setIsRunning(true)
    startTimeRef.current = new Date()
    
    // AI-powered session start coaching
    if (aiCoachingEnabled) {
      const startCoaching = await getSessionStartCoaching()
      setCurrentCoaching(startCoaching)
    }

    // Adapt timer length based on patterns
    if (adaptiveMode && sessionType === 'focus') {
      const adaptedLength = calculateAdaptiveLength()
      if (adaptedLength !== customMinutes) {
        setCustomMinutes(adaptedLength)
        setSecondsLeft(adaptedLength * 60)
      }
    }
  }

  const stopTimer = () => {
    setIsRunning(false)
    
    // Log incomplete session
    if (startTimeRef.current) {
      const session = {
        id: Date.now(),
        taskId: currentTask?.id,
        taskTitle: currentTask?.title || 'No task',
        sessionType,
        startTime: startTimeRef.current,
        endTime: new Date(),
        duration: Math.round((Date.now() - startTimeRef.current.getTime()) / 60000),
        completed: false,
        focusScore: focusScore
      }
      
      addToHistory(session)
    }
  }

  const resetTimer = () => {
    setIsRunning(false)
    setSecondsLeft(customMinutes * 60)
    setCurrentCoaching('')
  }

  const handleSessionComplete = async () => {
    setIsRunning(false)
    
    const session = {
      id: Date.now(),
      taskId: currentTask?.id,
      taskTitle: currentTask?.title || sessionType,
      sessionType,
      startTime: startTimeRef.current,
      endTime: new Date(),
      duration: customMinutes,
      completed: true,
      focusScore: focusScore
    }

    addToHistory(session)

    // AI completion coaching
    if (aiCoachingEnabled) {
      const completionCoaching = await getSessionCompletionCoaching(session)
      setCurrentCoaching(completionCoaching)
    }

    // Handle different session types
    if (sessionType === 'focus') {
      setSessionCount(prev => prev + 1)
      
      // Suggest break type
      const shouldTakeLongBreak = sessionCount > 0 && (sessionCount + 1) % 4 === 0
      const nextBreakType = shouldTakeLongBreak ? 'long-break' : 'short-break'
      const breakLength = shouldTakeLongBreak ? 15 : 5
      
      // Auto-switch to break if enabled
      setTimeout(() => {
        setSessionType(nextBreakType)
        setCustomMinutes(breakLength)
        setSecondsLeft(breakLength * 60)
      }, 2000)

      // Log to Supabase if user is authenticated
      if (user && currentTask && onSessionComplete) {
        onSessionComplete()
      }
    } else {
      // Break completed, suggest focus session
      setTimeout(() => {
        setSessionType('focus')
        const nextFocusLength = calculateAdaptiveLength()
        setCustomMinutes(nextFocusLength)
        setSecondsLeft(nextFocusLength * 60)
      }, 2000)
    }

    // Play completion sound (if enabled)
    playCompletionSound()
  }

  const addToHistory = (session) => {
    const newHistory = [...sessionHistory, session].slice(-50) // Keep last 50 sessions
    setSessionHistory(newHistory)
    localStorage.setItem('pomodoro_session_history', JSON.stringify(newHistory))
    analyzePatterns(newHistory)
  }

  const calculateAdaptiveLength = () => {
    // AI-based adaptive timing
    const hour = new Date().getHours()
    const isOptimalTime = dailyPatterns.bestFocusHours.includes(hour)
    const baseLength = dailyPatterns.averageSessionLength || 25
    
    if (isOptimalTime && dailyPatterns.completionRate > 80) {
      return Math.min(baseLength + 5, 45) // Extend by 5 minutes, max 45
    } else if (dailyPatterns.completionRate < 60) {
      return Math.max(baseLength - 5, 15) // Reduce by 5 minutes, min 15
    }
    
    return baseLength
  }

  const getSessionStartCoaching = async () => {
    const hour = new Date().getHours()
    const isOptimalTime = dailyPatterns.bestFocusHours.includes(hour)
    
    const context = {
      sessionType,
      currentHour: hour,
      isOptimalTime,
      completionRate: dailyPatterns.completionRate,
      sessionCount: sessionCount,
      taskTitle: currentTask?.title
    }

    if (aiRoadmapService.isOllamaAvailable) {
      return await getAIStartCoaching(context)
    } else {
      return getTemplateStartCoaching(context)
    }
  }

  const getAIStartCoaching = async (context) => {
    const prompt = `As a Pomodoro AI coach, provide a brief encouraging message for starting a ${context.sessionType} session. Current time is ${context.currentHour}:00, this is session #${context.sessionCount + 1}. Task: "${context.taskTitle}". Completion rate: ${context.completionRate}%. Keep it under 50 words, be motivating and specific.`

    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3.2',
          prompt: prompt,
          stream: false
        })
      })

      const result = await response.json()
      return result.response || getTemplateStartCoaching(context)
    } catch (error) {
      return getTemplateStartCoaching(context)
    }
  }

  const getTemplateStartCoaching = (context) => {
    if (context.sessionType === 'focus') {
      if (context.isOptimalTime) {
        return `🎯 Perfect timing! You're in your peak focus zone. Time to tackle "${context.taskTitle}" with full concentration. You've got this! 🚀`
      } else if (context.completionRate > 80) {
        return `🔥 You're on fire with ${context.completionRate}% completion rate! Keep that momentum going with "${context.taskTitle}". Focus mode activated! 💪`
      } else {
        return `🌱 Fresh start! Let's build some momentum with "${context.taskTitle}". Even small progress counts. Stay focused! ⭐`
      }
    } else if (context.sessionType === 'short-break') {
      return `☕ Quick break time! Stretch, hydrate, and give your mind a moment to process. You've earned this 5-minute recharge! 🌸`
    } else {
      return `🛋️ Long break well deserved! Take a walk, grab a snack, or do something you enjoy. Your brain will thank you for this reset! 🌈`
    }
  }

  const getSessionCompletionCoaching = async (session) => {
    const context = {
      sessionType: session.sessionType,
      completed: session.completed,
      focusScore: session.focusScore,
      sessionCount: sessionCount + 1,
      completionRate: dailyPatterns.completionRate
    }

    if (aiRoadmapService.isOllamaAvailable) {
      return await getAICompletionCoaching(context)
    } else {
      return getTemplateCompletionCoaching(context)
    }
  }

  const getAICompletionCoaching = async (context) => {
    const prompt = `As a Pomodoro AI coach, celebrate the completion of a ${context.sessionType} session. Focus score was ${context.focusScore}%. This was session #${context.sessionCount}. Provide encouraging feedback and suggest what to do next. Keep it under 60 words, be positive and actionable.`

    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3.2',
          prompt: prompt,
          stream: false
        })
      })

      const result = await response.json()
      return result.response || getTemplateCompletionCoaching(context)
    } catch (error) {
      return getTemplateCompletionCoaching(context)
    }
  }

  const getTemplateCompletionCoaching = (context) => {
    if (context.sessionType === 'focus') {
      if (context.focusScore >= 90) {
        return `🎉 Excellent focus session! ${context.focusScore}% focus score is outstanding. Your concentration is really paying off! Time for a well-deserved break. 🌟`
      } else if (context.focusScore >= 70) {
        return `👍 Good work! ${context.focusScore}% focus is solid progress. Every session builds your focus muscle. Ready for your break? 💪`
      } else {
        return `✅ Session complete! Even with some distractions, you pushed through. That's what builds discipline. Take your break and come back stronger! 🌱`
      }
    } else {
      return `🔋 Break complete! Feeling refreshed? Your mind has had time to process and recharge. Ready to dive back into focused work! 🚀`
    }
  }

  const provideRealTimeCoaching = () => {
    const timeRemaining = secondsLeft / 60
    const sessionProgress = ((customMinutes * 60 - secondsLeft) / (customMinutes * 60)) * 100

    if (sessionProgress > 50 && sessionProgress < 55) {
      setCurrentCoaching("🏃‍♂️ Halfway there! You're in the zone - keep that momentum going!")
    } else if (sessionProgress > 80 && sessionProgress < 85) {
      setCurrentCoaching("💪 Final stretch! You're almost at the finish line. Stay strong!")
    }
  }

  const playCompletionSound = () => {
    // Create a simple beep sound
    if (typeof window !== 'undefined') {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.value = 800
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    }
  }

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const getSessionIcon = () => {
    switch (sessionType) {
      case 'focus': return '🎯'
      case 'short-break': return '☕'
      case 'long-break': return '🛋️'
      default: return '⏱️'
    }
  }

  const getSessionColor = () => {
    switch (sessionType) {
      case 'focus': return 'from-blue-500 to-purple-500'
      case 'short-break': return 'from-green-500 to-teal-500'
      case 'long-break': return 'from-orange-500 to-red-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="text-2xl">🧠</span>
          Smart Pomodoro AI Coach
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAiCoachingEnabled(!aiCoachingEnabled)}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              aiCoachingEnabled 
                ? 'bg-green-500/20 text-green-300' 
                : 'bg-gray-500/20 text-gray-400'
            }`}
          >
            AI Coach: {aiCoachingEnabled ? 'ON' : 'OFF'}
          </button>
          <button
            onClick={() => setAdaptiveMode(!adaptiveMode)}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              adaptiveMode 
                ? 'bg-blue-500/20 text-blue-300' 
                : 'bg-gray-500/20 text-gray-400'
            }`}
          >
            Adaptive: {adaptiveMode ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Current Task */}
      <div className="mb-6">
        <div className="text-white/80 text-sm mb-2">Current Task:</div>
        <div className={`text-white font-medium ${!currentTask ? 'text-white/50 italic' : ''}`}>
          {currentTask ? currentTask.title : 'No task selected - select a task from the list to focus on'}
        </div>
        {currentTask && (
          <div className="text-white/60 text-xs mt-1">
            {currentTask.description && `${currentTask.description} • `}
            Estimated: {currentTask.estimated_minutes || 25} minutes
          </div>
        )}
      </div>

      {/* Session Type Selector */}
      <div className="flex gap-2 mb-6">
        {['focus', 'short-break', 'long-break'].map((type) => (
          <button
            key={type}
            onClick={() => {
              setSessionType(type)
              const minutes = type === 'focus' ? 25 : type === 'short-break' ? 5 : 15
              setCustomMinutes(minutes)
              setSecondsLeft(minutes * 60)
              setIsRunning(false)
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              sessionType === type
                ? 'bg-white/20 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            {type === 'focus' ? '🎯 Focus' : 
             type === 'short-break' ? '☕ Short Break' : '🛋️ Long Break'}
            <div className="text-xs opacity-60">
              {type === 'focus' ? `${dailyPatterns.averageSessionLength}m` : 
               type === 'short-break' ? '5m' : '15m'}
            </div>
          </button>
        ))}
      </div>

      {/* Timer Display */}
      <div className="text-center mb-6">
        <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r ${getSessionColor()} text-white text-3xl font-mono font-bold mb-4`}>
          {formatTime(secondsLeft)}
        </div>
        <div className="text-white/80 text-lg">
          {getSessionIcon()} {sessionType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-white/20 rounded-full h-2 mt-4">
          <div 
            className={`h-2 rounded-full bg-gradient-to-r ${getSessionColor()} transition-all duration-1000`}
            style={{ 
              width: `${((customMinutes * 60 - secondsLeft) / (customMinutes * 60)) * 100}%` 
            }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 mb-6">
        {!isRunning ? (
          <button
            onClick={startTimer}
            disabled={sessionType === 'focus' && !currentTask}
            className={`flex-1 font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 ${
              sessionType === 'focus' && !currentTask
                ? 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
                : `bg-gradient-to-r ${getSessionColor()} hover:opacity-90 text-white`
            }`}
          >
            {sessionType === 'focus' && !currentTask 
              ? 'Select a task first'
              : `Start ${sessionType.replace('-', ' ')}`
            }
          </button>
        ) : (
          <button
            onClick={stopTimer}
            className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
          >
            Stop Session
          </button>
        )}
        <button
          onClick={resetTimer}
          className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Reset
        </button>
      </div>

      {/* AI Coaching Messages */}
      {currentCoaching && (
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-lg p-4 mb-6">
          <div className="text-purple-200 text-sm font-medium mb-1">🧠 AI Coach Says:</div>
          <div className="text-white">{currentCoaching}</div>
        </div>
      )}

      {/* Session Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/5 rounded-lg p-3">
          <div className="text-white/60 text-xs">Today's Sessions</div>
          <div className="text-white text-xl font-bold">{sessionCount}</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3">
          <div className="text-white/60 text-xs">Completion Rate</div>
          <div className="text-white text-xl font-bold">{dailyPatterns.completionRate}%</div>
        </div>
      </div>

      {/* AI Insights */}
      {dailyPatterns.bestFocusHours.length > 0 && (
        <div className="bg-white/5 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <span>📊</span> AI Insights
          </h3>
          <div className="space-y-2 text-sm">
            <div className="text-white/80">
              🕐 Best focus hours: {dailyPatterns.bestFocusHours.map(h => `${h}:00`).join(', ')}
            </div>
            <div className="text-white/80">
              ⏱️ Optimal session length: {dailyPatterns.averageSessionLength} minutes
            </div>
            <div className="text-white/80">
              🎯 Success rate: {dailyPatterns.completionRate}%
            </div>
          </div>
        </div>
      )}
    </div>
  )
}