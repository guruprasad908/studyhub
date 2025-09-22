// AI Focus Optimizer Component
'use client'

import { useState, useEffect } from 'react'
import { aiRoadmapService } from '../lib/aiService'

export default function AIFocusOptimizer({ 
  user, 
  studyData 
}) {
  const [focusPlan, setFocusPlan] = useState(null)
  const [loading, setLoading] = useState(false)
  const [aiStatus, setAiStatus] = useState('Checking AI availability...')

  useEffect(() => {
    checkAIStatus()
  }, [])

  const checkAIStatus = async () => {
    await aiRoadmapService.checkOllamaAvailability()
    setAiStatus(aiRoadmapService.isOllamaAvailable ? 
      '🤖 Local AI Ready (Ollama)' : '📝 Template-based Focus Optimization Ready')
  }

  const generateFocusPlan = async () => {
    if (!user || !studyData) return

    setLoading(true)
    try {
      // For now, we'll use empty user preferences, but this could be expanded
      const userPreferences = {}
      const focusOptimizationPlan = await aiRoadmapService.generateFocusOptimizationPlan(studyData, userPreferences)
      setFocusPlan(focusOptimizationPlan)
    } catch (error) {
      console.error('Error generating focus optimization plan:', error)
      alert('Error generating focus optimization plan. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400'
      case 'intermediate': return 'text-yellow-400'
      default: return 'text-red-400'
    }
  }

  const getDifficultyBg = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 border-green-500/30'
      case 'intermediate': return 'bg-yellow-500/20 border-yellow-500/30'
      default: return 'bg-red-500/20 border-red-500/30'
    }
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
            <p className="text-white">Creating your personalized focus optimization plan with AI...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!focusPlan) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            AI Focus Optimizer
          </h2>
          <div className="text-sm text-white/60">{aiStatus}</div>
        </div>

        <div className="text-center py-12">
          <div className="text-5xl mb-4">🧠</div>
          <h3 className="text-xl font-semibold text-white mb-2">Personalized Focus Enhancement</h3>
          <p className="text-white/60 mb-6">
            Get AI-powered strategies to eliminate distractions and maximize your study focus
          </p>
          <button
            onClick={generateFocusPlan}
            disabled={!user || !studyData}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
          >
            Generate Focus Plan
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
            <span className="text-2xl">🎯</span>
            AI Focus Optimizer
          </h2>
          <div className="text-sm text-white/60">{aiStatus}</div>
        </div>

        {/* Distraction Analysis */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">🔍 Distraction Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-white/80 text-sm mb-2">Common Distractions</div>
              <div className="space-y-2">
                {focusPlan.distractionAnalysis.commonDistractions.slice(0, 3).map((distraction, index) => (
                  <div key={index} className="text-white/90 text-sm bg-red-500/20 px-2 py-1 rounded">
                    {distraction}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-white/80 text-sm mb-2">Impact</div>
              <p className="text-white/90 text-sm">
                {focusPlan.distractionAnalysis.distractionImpact}
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-white/80 text-sm mb-2">Peak Times</div>
              <div className="space-y-2">
                {focusPlan.distractionAnalysis.peakDistractionTimes.slice(0, 3).map((time, index) => (
                  <div key={index} className="text-white/90 text-sm bg-yellow-500/20 px-2 py-1 rounded">
                    {time}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Personalized Strategies */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">💡 Personalized Strategies</h3>
          <div className="space-y-4">
            {focusPlan.personalizedStrategies.map((strategy, index) => (
              <div key={index} className={`rounded-lg p-4 border ${getDifficultyBg(strategy.difficulty)}`}>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-white">{strategy.strategy}</h4>
                  <span className={`text-sm font-medium ${getDifficultyColor(strategy.difficulty)}`}>
                    {strategy.difficulty}
                  </span>
                </div>
                <p className="text-white/80 text-sm mb-2">{strategy.description}</p>
                <div className="text-xs text-white/60">
                  Estimated time: {strategy.estimatedTime}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Environment Optimization */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">🏠 Environment Optimization</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-white/80 text-sm font-medium mb-2">Physical Setup</div>
              <ul className="space-y-2">
                {focusPlan.environmentOptimization.physicalSetup.map((tip, index) => (
                  <li key={index} className="text-white/90 text-sm flex items-start gap-2">
                    <span>🔸</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-white/80 text-sm font-medium mb-2">Digital Setup</div>
              <ul className="space-y-2">
                {focusPlan.environmentOptimization.digitalSetup.map((tip, index) => (
                  <li key={index} className="text-white/90 text-sm flex items-start gap-2">
                    <span>🔸</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-white/80 text-sm font-medium mb-2">Routine Suggestions</div>
              <ul className="space-y-2">
                {focusPlan.environmentOptimization.routineSuggestions.map((tip, index) => (
                  <li key={index} className="text-white/90 text-sm flex items-start gap-2">
                    <span>🔸</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Focus Building Exercises */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">🏋️ Focus Building Exercises</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {focusPlan.focusBuildingExercises.map((exercise, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-medium text-white mb-2">{exercise.exercise}</h4>
                <p className="text-white/80 text-sm mb-3">{exercise.description}</p>
                <div className="flex items-center justify-between text-xs text-white/60">
                  <span>⏱️ {exercise.duration}</span>
                  <span>📅 {exercise.frequency}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Tracking */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">📈 Progress Tracking</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-white/80 text-sm font-medium mb-2">Key Metrics</div>
              <ul className="space-y-2">
                {focusPlan.progressTracking.keyMetrics.map((metric, index) => (
                  <li key={index} className="text-white/90 text-sm flex items-start gap-2">
                    <span>📊</span>
                    <span>{metric}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-white/80 text-sm font-medium mb-2">Milestones</div>
              <ul className="space-y-2">
                {focusPlan.progressTracking.milestones.map((milestone, index) => (
                  <li key={index} className="text-white/90 text-sm flex items-start gap-2">
                    <span>🏆</span>
                    <span>{milestone}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-white/80 text-sm font-medium mb-2">Review Schedule</div>
              <div className="text-white/90 text-sm">
                {focusPlan.progressTracking.reviewSchedule}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <button
            onClick={generateFocusPlan}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200"
          >
            🔄 Refresh Focus Plan
          </button>
        </div>
      </div>
    </div>
  )
}