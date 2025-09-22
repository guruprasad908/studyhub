// AI Adaptive Learning Component
'use client'

import { useState, useEffect } from 'react'
import { aiRoadmapService } from '../lib/aiService'

export default function AIAdaptiveLearning({ 
  user, 
  studyData 
}) {
  const [learningPath, setLearningPath] = useState(null)
  const [loading, setLoading] = useState(false)
  const [aiStatus, setAiStatus] = useState('Checking AI availability...')

  useEffect(() => {
    checkAIStatus()
  }, [])

  const checkAIStatus = async () => {
    await aiRoadmapService.checkOllamaAvailability()
    setAiStatus(aiRoadmapService.isOllamaAvailable ? 
      '🤖 Local AI Ready (Ollama)' : '📝 Template-based Adaptive Learning Ready')
  }

  const generateLearningPath = async () => {
    if (!user || !studyData) return

    setLoading(true)
    try {
      // For now, we'll use empty user preferences, but this could be expanded
      const userPreferences = {}
      const adaptiveLearningPath = await aiRoadmapService.generateAdaptiveLearningPath(studyData, userPreferences)
      setLearningPath(adaptiveLearningPath)
    } catch (error) {
      console.error('Error generating adaptive learning path:', error)
      alert('Error generating adaptive learning path. Please try again.')
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

  const getLevelColor = (level) => {
    switch (level) {
      case 'beginner': return 'text-green-400'
      case 'intermediate': return 'text-yellow-400'
      default: return 'text-red-400'
    }
  }

  const getLevelBg = (level) => {
    switch (level) {
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
            <p className="text-white">Creating your personalized adaptive learning path with AI...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!learningPath) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">📈</span>
            AI Adaptive Learning Path
          </h2>
          <div className="text-sm text-white/60">{aiStatus}</div>
        </div>

        <div className="text-center py-12">
          <div className="text-5xl mb-4">🧠</div>
          <h3 className="text-xl font-semibold text-white mb-2">Personalized Learning Journey</h3>
          <p className="text-white/60 mb-6">
            Get an AI-powered adaptive learning path that evolves with your progress
          </p>
          <button
            onClick={generateLearningPath}
            disabled={!user || !studyData}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
          >
            Generate Learning Path
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
            <span className="text-2xl">📈</span>
            AI Adaptive Learning Path
          </h2>
          <div className="text-sm text-white/60">{aiStatus}</div>
        </div>

        {/* Current Level */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">🎓 Your Current Level</h3>
          <div className={`rounded-lg p-6 border ${getLevelBg(learningPath.learningPath.currentLevel)} text-center`}>
            <div className="text-4xl mb-2">
              {learningPath.learningPath.currentLevel === 'beginner' ? '🌱' : 
               learningPath.learningPath.currentLevel === 'intermediate' ? '🌿' : '🌳'}
            </div>
            <div className={`text-2xl font-bold ${getLevelColor(learningPath.learningPath.currentLevel)}`}>
              {learningPath.learningPath.currentLevel.charAt(0).toUpperCase() + learningPath.learningPath.currentLevel.slice(1)} Learner
            </div>
            <p className="text-white/80 mt-2">
              Based on your focus, consistency, and progress patterns
            </p>
          </div>
        </div>

        {/* Skill Assessment */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">📊 Skill Assessment</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-white/80 text-sm font-medium mb-2">Your Strengths</div>
              <ul className="space-y-2">
                {learningPath.learningPath.skillAssessment.strengths.map((strength, index) => (
                  <li key={index} className="text-white/90 text-sm flex items-start gap-2">
                    <span>✅</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-white/80 text-sm font-medium mb-2">Areas for Improvement</div>
              <ul className="space-y-2">
                {learningPath.learningPath.skillAssessment.areasForImprovement.map((area, index) => (
                  <li key={index} className="text-white/90 text-sm flex items-start gap-2">
                    <span>🔄</span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-white/80 text-sm font-medium mb-2">Recommended Focus</div>
              <ul className="space-y-2">
                {learningPath.learningPath.skillAssessment.recommendedFocus.map((focus, index) => (
                  <li key={index} className="text-white/90 text-sm flex items-start gap-2">
                    <span>🎯</span>
                    <span>{focus}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">🚀 Next Steps in Your Journey</h3>
          <div className="space-y-4">
            {learningPath.learningPath.nextSteps.map((step, index) => (
              <div key={index} className={`rounded-lg p-4 border ${getDifficultyBg(step.difficulty)}`}>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-white">{step.step}</h4>
                  <span className={`text-sm font-medium ${getDifficultyColor(step.difficulty)}`}>
                    {step.difficulty}
                  </span>
                </div>
                <p className="text-white/80 text-sm mb-3">{step.description}</p>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="text-xs text-white/60">
                    Estimated time: {step.estimatedTime}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {step.resources.map((resource, idx) => (
                      <span key={idx} className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/80">
                        {resource}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Adaptive Adjustments */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">🔄 Adaptive Adjustments</h3>
          <div className="space-y-4">
            {learningPath.learningPath.adaptiveAdjustments.map((adjustment, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-start gap-3">
                  <div className="text-2xl mt-1">⚡</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white mb-1">When: {adjustment.trigger}</h4>
                    <p className="text-white/80 text-sm mb-2">
                      <span className="font-medium">Adjustment:</span> {adjustment.adjustment}
                    </p>
                    <p className="text-white/60 text-sm">
                      <span className="font-medium">Reason:</span> {adjustment.reasoning}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <button
            onClick={generateLearningPath}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200"
          >
            🔄 Refresh Learning Path
          </button>
        </div>
      </div>
    </div>
  )
}