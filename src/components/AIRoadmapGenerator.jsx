// AI-Enhanced Roadmap Generator Component
'use client'

import { useState, useEffect } from 'react'
import { aiRoadmapService } from '../lib/aiService'
import Link from 'next/link'

export default function AIRoadmapGenerator() {
  const [subject, setSubject] = useState('')
  const [level, setLevel] = useState('beginner')
  const [timeframe, setTimeframe] = useState('6 months')
  const [roadmap, setRoadmap] = useState(null)
  const [currentWeek, setCurrentWeek] = useState(1)
  const [dailyTasks, setDailyTasks] = useState([])
  const [todayQuestion, setTodayQuestion] = useState(null)
  const [completedTasks, setCompletedTasks] = useState([])
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(false)
  const [aiStatus, setAiStatus] = useState('Checking AI availability...')

  // Popular subjects for quick selection
  const popularSubjects = [
    'Data Scientist', 'Web Developer', 'Machine Learning', 'Python',
    'JavaScript', 'React', 'Node.js', 'Artificial Intelligence',
    'Cybersecurity', 'Cloud Computing', 'DevOps', 'Mobile Development'
  ]

  useEffect(() => {
    checkAIStatus()
    loadSavedProgress()
  }, [])

  useEffect(() => {
    if (roadmap) {
      generateDailyContent()
      calculateProgress()
      saveProgress()
    }
  }, [roadmap, currentWeek, completedTasks])

  const checkAIStatus = async () => {
    await aiRoadmapService.checkOllamaAvailability()
    setAiStatus(aiRoadmapService.isOllamaAvailable ? 
      '🤖 Local AI Ready (Ollama)' : '📝 Template-based Generation Ready')
  }

  const loadSavedProgress = () => {
    const saved = localStorage.getItem('studyhub_roadmap_progress')
    if (saved) {
      const data = JSON.parse(saved)
      setRoadmap(data.roadmap)
      setCurrentWeek(data.currentWeek || 1)
      setCompletedTasks(data.completedTasks || [])
      setSubject(data.subject || '')
      setLevel(data.level || 'beginner')
      setTimeframe(data.timeframe || '6 months')
    }
  }

  const saveProgress = () => {
    if (roadmap) {
      localStorage.setItem('studyhub_roadmap_progress', JSON.stringify({
        roadmap,
        currentWeek,
        completedTasks,
        subject,
        level,
        timeframe,
        lastUpdated: new Date().toISOString()
      }))
    }
  }

  const generateRoadmap = async () => {
    if (!subject.trim()) return

    setLoading(true)
    try {
      const generatedRoadmap = await aiRoadmapService.generateRoadmap(subject, level, timeframe)
      setRoadmap(generatedRoadmap)
      setCurrentWeek(1)
      setCompletedTasks([])
    } catch (error) {
      console.error('Error generating roadmap:', error)
      alert('Error generating roadmap. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const generateDailyContent = async () => {
    if (!roadmap) return

    try {
      const tasks = await aiRoadmapService.generateDailyTasks(roadmap, currentWeek, completedTasks)
      setDailyTasks(tasks)

      const question = await aiRoadmapService.generateDailyQuestion(roadmap, currentWeek)
      setTodayQuestion(question)
    } catch (error) {
      console.error('Error generating daily content:', error)
    }
  }

  const calculateProgress = () => {
    if (!roadmap) return

    const progressData = aiRoadmapService.calculateProgress(roadmap, completedTasks, currentWeek)
    setProgress(progressData)
  }

  const toggleTaskCompletion = (taskId) => {
    setCompletedTasks(prev => {
      const existing = prev.find(t => t.id === taskId)
      if (existing) {
        return prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
      } else {
        const task = dailyTasks.find(t => t.id === taskId)
        return [...prev, { ...task, completed: true, completedAt: new Date().toISOString() }]
      }
    })
  }

  const advanceWeek = () => {
    if (currentWeek < roadmap.totalWeeks) {
      setCurrentWeek(prev => prev + 1)
    }
  }

  const goToPreviousWeek = () => {
    if (currentWeek > 1) {
      setCurrentWeek(prev => prev - 1)
    }
  }

  const resetRoadmap = () => {
    setRoadmap(null)
    setCurrentWeek(1)
    setCompletedTasks([])
    setDailyTasks([])
    setTodayQuestion(null)
    setProgress(null)
    localStorage.removeItem('studyhub_roadmap_progress')
  }

  if (roadmap) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link href="/" className="text-white/80 hover:text-white mb-4 inline-flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Home
              </Link>
              <h1 className="text-4xl font-bold text-white">{roadmap.title}</h1>
              <p className="text-blue-200 mt-2">{roadmap.description}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-white/60 mb-2">{aiStatus}</div>
              <button
                onClick={resetRoadmap}
                className="text-red-300 hover:text-red-200 text-sm"
              >
                🔄 Generate New Roadmap
              </button>
            </div>
          </div>

          {/* Progress Overview */}
          {progress && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">📊 Your Progress</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">{Math.round(progress.overallProgress)}%</div>
                  <div className="text-white/80">Overall Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">{progress.currentWeek}/{progress.totalWeeks}</div>
                  <div className="text-white/80">Weeks</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">{Math.round(progress.weeklyProgress)}%</div>
                  <div className="text-white/80">This Week</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">{progress.completedTasks}</div>
                  <div className="text-white/80">Tasks Done</div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress.overallProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Insights */}
              {progress.insights && progress.insights.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-white mb-2">💡 AI Insights</h3>
                  <div className="space-y-2">
                    {progress.insights.map((insight, index) => (
                      <div key={index} className="text-white/80 bg-white/10 rounded-lg p-3">
                        {insight}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Current Week Tasks */}
            <div className="lg:col-span-2">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">📅 Week {currentWeek} Tasks</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={goToPreviousWeek}
                      disabled={currentWeek === 1}
                      className="px-3 py-1 bg-white/10 rounded-lg text-white disabled:opacity-50"
                    >
                      ← Prev
                    </button>
                    <button
                      onClick={advanceWeek}
                      disabled={currentWeek === roadmap.totalWeeks}
                      className="px-3 py-1 bg-white/10 rounded-lg text-white disabled:opacity-50"
                    >
                      Next →
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {dailyTasks.map((task, index) => {
                    const isCompleted = completedTasks.some(ct => ct.id === task.id && ct.completed)
                    return (
                      <div 
                        key={task.id}
                        className={`p-4 rounded-lg border transition-all cursor-pointer ${
                          isCompleted 
                            ? 'bg-green-500/20 border-green-500/30' 
                            : 'bg-white/5 border-white/20 hover:bg-white/10'
                        }`}
                        onClick={() => toggleTaskCompletion(task.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              isCompleted ? 'bg-green-500 border-green-500' : 'border-white/40'
                            }`}>
                              {isCompleted && <span className="text-white text-sm">✓</span>}
                            </div>
                            <div>
                              <div className={`font-medium ${isCompleted ? 'text-green-200' : 'text-white'}`}>
                                Day {task.day}: {task.task}
                              </div>
                              <div className="text-sm text-white/60">
                                📍 {task.timeEstimate} • {task.difficulty || 'medium'} difficulty
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Today's Question */}
              {todayQuestion && (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-4">🤔 Today's Challenge</h3>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-white font-medium mb-2">{todayQuestion.question}</div>
                    <div className="text-sm text-white/60">
                      Type: {todayQuestion.type} • Difficulty: {todayQuestion.difficulty}
                    </div>
                  </div>
                  <textarea
                    placeholder="Write your answer here..."
                    className="w-full mt-4 p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  ></textarea>
                  <button className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-sm hover:from-blue-600 hover:to-purple-600">
                    Save Answer
                  </button>
                </div>
              )}

              {/* Current Phase Info */}
              {roadmap.phases && (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-4">📚 Current Phase</h3>
                  {roadmap.phases.map((phase, index) => {
                    const weekRange = phase.weeks.match(/Week (\d+)-(\d+)/)
                    if (weekRange) {
                      const start = parseInt(weekRange[1])
                      const end = parseInt(weekRange[2])
                      if (currentWeek >= start && currentWeek <= end) {
                        return (
                          <div key={index}>
                            <h4 className="text-lg font-semibold text-blue-300">{phase.phase}</h4>
                            <p className="text-white/80 mt-2">{phase.description}</p>
                            <div className="mt-4">
                              <h5 className="text-sm font-medium text-white mb-2">📖 Topics:</h5>
                              <div className="flex flex-wrap gap-2">
                                {phase.topics.map((topic, i) => (
                                  <span key={i} className="px-2 py-1 bg-blue-500/20 text-blue-200 rounded text-sm">
                                    {topic}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="mt-4">
                              <h5 className="text-sm font-medium text-white mb-2">🎯 Weekly Goal:</h5>
                              <p className="text-white/80 text-sm">{phase.weeklyGoal}</p>
                            </div>
                          </div>
                        )
                      }
                    }
                    return null
                  })}
                </div>
              )}

              {/* Motivational Tips */}
              {roadmap.motivationalTips && (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-4">💪 Stay Motivated</h3>
                  <div className="space-y-3">
                    {roadmap.motivationalTips.slice(0, 3).map((tip, index) => (
                      <div key={index} className="text-white/80 text-sm">
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Initial roadmap generation UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Link href="/" className="text-white/80 hover:text-white mb-8 inline-flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">AI Roadmap Generator</h1>
            <p className="text-blue-200">Get a personalized learning path with daily tasks and practice questions</p>
            <div className="text-sm text-white/60 mt-2">{aiStatus}</div>
          </div>

          <div className="space-y-6">
            {/* Subject Input */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                What do you want to learn?
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="e.g., Data Science, Web Development, Python..."
              />
            </div>

            {/* Quick Select */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Or choose from popular subjects:
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {popularSubjects.map((subj) => (
                  <button
                    key={subj}
                    onClick={() => setSubject(subj)}
                    className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm transition-all"
                  >
                    {subj}
                  </button>
                ))}
              </div>
            </div>

            {/* Level and Timeframe */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Your Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="beginner" className="bg-gray-800">Beginner</option>
                  <option value="intermediate" className="bg-gray-800">Intermediate</option>
                  <option value="advanced" className="bg-gray-800">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Timeframe</label>
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="3 months" className="bg-gray-800">3 Months</option>
                  <option value="6 months" className="bg-gray-800">6 Months</option>
                  <option value="12 months" className="bg-gray-800">12 Months</option>
                </select>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateRoadmap}
              disabled={loading || !subject.trim()}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating AI Roadmap...
                </div>
              ) : (
                '🚀 Generate My Learning Roadmap'
              )}
            </button>

            <div className="text-center text-white/60 text-sm">
              ✨ Powered by AI • Completely Free • Works Offline
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}