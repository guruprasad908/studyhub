// Personalized Content Recommendations Component
'use client'

import { useState, useEffect } from 'react'
import { aiRoadmapService } from '../lib/aiService'

export default function PersonalizedContentRecommendations({ 
  user, 
  studyData 
}) {
  const [recommendations, setRecommendations] = useState(null)
  const [loading, setLoading] = useState(false)
  const [aiStatus, setAiStatus] = useState('Checking AI availability...')

  useEffect(() => {
    checkAIStatus()
    if (studyData) {
      generateRecommendations()
    }
  }, [studyData])

  const checkAIStatus = async () => {
    await aiRoadmapService.checkOllamaAvailability()
    setAiStatus(aiRoadmapService.isOllamaAvailable ? 
      '🤖 Local AI Ready (Ollama)' : '📝 Template-based Recommendations Ready')
  }

  const generateRecommendations = async () => {
    if (!studyData) return

    setLoading(true)
    try {
      // For now, we'll use empty user preferences, but this could be expanded
      const userPreferences = {}
      const contentRecommendations = await aiRoadmapService.generateContentRecommendations(studyData, userPreferences)
      setRecommendations(contentRecommendations)
    } catch (error) {
      console.error('Error generating recommendations:', error)
      alert('Error generating recommendations. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getResourceIcon = (type) => {
    switch (type) {
      case 'article': return '📰'
      case 'video': return '🎥'
      case 'course': return '📚'
      case 'book': return '📖'
      case 'practice': return '✍️'
      default: return '📄'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-400'
      case 'medium': return 'text-yellow-400'
      default: return 'text-green-400'
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
            <p className="text-white">Generating personalized recommendations with AI...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!recommendations) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            Personalized Recommendations
          </h2>
          <div className="text-sm text-white/60">{aiStatus}</div>
        </div>

        <div className="text-center py-12">
          <div className="text-5xl mb-4">🧠</div>
          <h3 className="text-xl font-semibold text-white mb-2">AI-Powered Learning Suggestions</h3>
          <p className="text-white/60 mb-6">
            Get personalized content recommendations based on your study patterns and progress
          </p>
          <button
            onClick={generateRecommendations}
            disabled={!studyData}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
          >
            Generate Recommendations
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
            Personalized Recommendations
          </h2>
          <div className="text-sm text-white/60">{aiStatus}</div>
        </div>

        {/* Study Plan */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">📚 Your Personalized Study Plan</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-white/80 text-sm mb-2">Focus Areas</div>
              <div className="space-y-2">
                {recommendations.studyPlan.focusAreas.slice(0, 3).map((area, index) => (
                  <div key={index} className="text-white/90 text-sm bg-blue-500/20 px-2 py-1 rounded">
                    {area}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-white/80 text-sm mb-2">Next Steps</div>
              <div className="space-y-2">
                {recommendations.studyPlan.nextSteps.slice(0, 3).map((step, index) => (
                  <div key={index} className="text-white/90 text-sm bg-green-500/20 px-2 py-1 rounded">
                    {step}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-white/80 text-sm mb-2">Pro Tips</div>
              <div className="space-y-2">
                {recommendations.studyPlan.tips.slice(0, 3).map((tip, index) => (
                  <div key={index} className="text-white/90 text-sm bg-purple-500/20 px-2 py-1 rounded">
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">🔍 Recommended Resources</h3>
          <div className="space-y-4">
            {recommendations.recommendations.map((rec, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="text-2xl mt-1">{getResourceIcon(rec.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-white">{rec.title}</h4>
                      <span className={`text-sm font-medium ${getPriorityColor(rec.priority)}`}>
                        {rec.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-white/80 text-sm mt-1">{rec.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-white/60">
                      <span>Type: {rec.type}</span>
                      <span>Difficulty: {rec.difficulty}</span>
                      <span>Time: {rec.estimatedTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 text-center">
          <button
            onClick={generateRecommendations}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200"
          >
            🔄 Refresh Recommendations
          </button>
        </div>
      </div>
    </div>
  )
}