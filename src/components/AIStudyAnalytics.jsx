// AI Study Analytics Dashboard Component
'use client'

import { useState, useEffect } from 'react'
import { aiRoadmapService } from '../lib/aiService'

export default function AIStudyAnalytics({ 
  user, 
  studyData 
}) {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(false)
  const [aiStatus, setAiStatus] = useState('Checking AI availability...')
  const [timeframe, setTimeframe] = useState('weekly')

  useEffect(() => {
    checkAIStatus()
    if (studyData) {
      generateAnalytics()
    }
  }, [studyData])

  const checkAIStatus = async () => {
    await aiRoadmapService.checkOllamaAvailability()
    setAiStatus(aiRoadmapService.isOllamaAvailable ? 
      '🤖 Local AI Ready (Ollama)' : '📝 Template-based Analytics Ready')
  }

  const generateAnalytics = async () => {
    if (!studyData) return

    setLoading(true)
    try {
      const analysis = await aiRoadmapService.analyzeStudyPatterns(studyData, timeframe)
      setAnalytics(analysis)
    } catch (error) {
      console.error('Error generating analytics:', error)
      alert('Error generating analytics. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getPerformanceColor = (score) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getPerformanceBg = (score) => {
    if (score >= 80) return 'bg-green-500/20 border-green-500/30'
    if (score >= 60) return 'bg-yellow-500/20 border-yellow-500/30'
    return 'bg-red-500/20 border-red-500/30'
  }

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 text-purple-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-white">Analyzing your study patterns with AI...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">📊</span>
            AI Study Analytics
          </h2>
          <div className="text-sm text-white/60">{aiStatus}</div>
        </div>

        <div className="text-center py-12">
          <div className="text-5xl mb-4">📈</div>
          <h3 className="text-xl font-semibold text-white mb-2">Study Pattern Analysis</h3>
          <p className="text-white/60 mb-6">
            Get AI-powered insights into your study habits and personalized recommendations
          </p>
          <button
            onClick={generateAnalytics}
            disabled={!studyData}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
          >
            Generate AI Analysis
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">📊</span>
            AI Study Analytics
          </h2>
          <div className="flex items-center gap-3">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="weekly" className="bg-gray-800">Weekly</option>
              <option value="monthly" className="bg-gray-800">Monthly</option>
              <option value="overall" className="bg-gray-800">Overall</option>
            </select>
            <div className="text-sm text-white/60">{aiStatus}</div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-white/60 text-sm mb-1">Study Consistency</div>
            <div className={`text-2xl font-bold ${getPerformanceColor(analytics.consistencyScore)}`}>
              {analytics.consistencyScore}%
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-white/60 text-sm mb-1">Focus Quality</div>
            <div className={`text-2xl font-bold ${getPerformanceColor(analytics.focusScore)}`}>
              {analytics.focusScore}%
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-white/60 text-sm mb-1">Goal Progress</div>
            <div className={`text-2xl font-bold ${getPerformanceColor(analytics.progressScore)}`}>
              {analytics.progressScore}%
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-white/60 text-sm mb-1">Predicted Success</div>
            <div className={`text-2xl font-bold ${getPerformanceColor(analytics.predictedSuccess)}`}>
              {analytics.predictedSuccess}%
            </div>
          </div>
        </div>

        {/* Main Insights */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">🧠 AI Insights</h3>
          <div className="space-y-4">
            {analytics.insights.slice(0, 3).map((insight, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm">⭐</span>
                  </div>
                  <p className="text-white/90">{insight}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">🎯 Personalized Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analytics.recommendations.slice(0, 4).map((rec, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-teal-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm">💡</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-1">{rec.title}</h4>
                    <p className="text-white/80 text-sm">{rec.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Study Pattern Analysis */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">🕒 Study Patterns</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`rounded-lg p-4 border ${getPerformanceBg(analytics.peakHours.score)}`}>
              <div className="text-white/80 text-sm mb-2">Peak Study Hours</div>
              <div className="text-white font-medium">
                {analytics.peakHours.hours.join(', ')}:00
              </div>
              <div className={`text-sm mt-2 ${getPerformanceColor(analytics.peakHours.score)}`}>
                {analytics.peakHours.score >= 80 ? '⭐ Optimal timing' : 
                 analytics.peakHours.score >= 60 ? '👍 Good consistency' : 
                 '🌱 Room for improvement'}
              </div>
            </div>
            
            <div className={`rounded-lg p-4 border ${getPerformanceBg(analytics.sessionLength.score)}`}>
              <div className="text-white/80 text-sm mb-2">Average Session Length</div>
              <div className="text-white font-medium">
                {analytics.sessionLength.minutes} minutes
              </div>
              <div className={`text-sm mt-2 ${getPerformanceColor(analytics.sessionLength.score)}`}>
                {analytics.sessionLength.score >= 80 ? '⭐ Ideal duration' : 
                 analytics.sessionLength.score >= 60 ? '👍 Good focus' : 
                 '🌱 Try longer sessions'}
              </div>
            </div>
            
            <div className={`rounded-lg p-4 border ${getPerformanceBg(analytics.breakBalance.score)}`}>
              <div className="text-white/80 text-sm mb-2">Break Balance</div>
              <div className="text-white font-medium">
                {analytics.breakBalance.ratio} work/break ratio
              </div>
              <div className={`text-sm mt-2 ${getPerformanceColor(analytics.breakBalance.score)}`}>
                {analytics.breakBalance.score >= 80 ? '⭐ Perfect balance' : 
                 analytics.breakBalance.score >= 60 ? '👍 Good balance' : 
                 '🌱 Adjust break timing'}
              </div>
            </div>
          </div>
        </div>

        {/* Motivation Tracker */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">💪 Motivation Insights</h3>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/80">Current Motivation Level</span>
              <span className="text-white font-medium">{analytics.motivation.current}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 mb-4">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${analytics.motivation.current}%` }}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <div className="text-white/80 text-sm mb-2">Motivation Trends</div>
                <div className="text-white/90 text-sm">
                  {analytics.motivation.trend > 0 ? '📈 Increasing' : 
                   analytics.motivation.trend < 0 ? '📉 Decreasing' : '➡️ Stable'}
                </div>
              </div>
              <div>
                <div className="text-white/80 text-sm mb-2">Boost Suggestions</div>
                <div className="text-white/90 text-sm">
                  {analytics.motivation.suggestions[0]}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}