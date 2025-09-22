// AI Study Group Matcher Component
'use client'

import { useState, useEffect } from 'react'
import { aiRoadmapService } from '../lib/aiService'

export default function AIStudyGroupMatcher({ 
  user, 
  studyData,
  allUsersData = []
}) {
  const [matches, setMatches] = useState(null)
  const [loading, setLoading] = useState(false)
  const [aiStatus, setAiStatus] = useState('Checking AI availability...')

  useEffect(() => {
    checkAIStatus()
  }, [])

  const checkAIStatus = async () => {
    await aiRoadmapService.checkOllamaAvailability()
    setAiStatus(aiRoadmapService.isOllamaAvailable ? 
      '🤖 Local AI Ready (Ollama)' : '📝 Template-based Matching Ready')
  }

  const findStudyGroupMatches = async () => {
    if (!user || !studyData) return

    setLoading(true)
    try {
      // Prepare user data for matching
      const userData = {
        userId: user.id,
        ...studyData
      }
      
      const groupMatches = await aiRoadmapService.matchStudyGroups(userData, allUsersData)
      setMatches(groupMatches)
    } catch (error) {
      console.error('Error finding study group matches:', error)
      alert('Error finding study group matches. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getSimilarityColor = (score) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getSimilarityBg = (score) => {
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
            <p className="text-white">Finding compatible study partners with AI...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!matches) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">👥</span>
            AI Study Group Matcher
          </h2>
          <div className="text-sm text-white/60">{aiStatus}</div>
        </div>

        <div className="text-center py-12">
          <div className="text-5xl mb-4">🤝</div>
          <h3 className="text-xl font-semibold text-white mb-2">Find Your Perfect Study Partners</h3>
          <p className="text-white/60 mb-6">
            Get AI-powered recommendations for study partners and groups based on your learning patterns
          </p>
          <button
            onClick={findStudyGroupMatches}
            disabled={!user || !studyData}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
          >
            Find Study Partners
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
            <span className="text-2xl">👥</span>
            AI Study Group Matcher
          </h2>
          <div className="text-sm text-white/60">{aiStatus}</div>
        </div>

        {/* User Matches */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">🎯 Compatible Study Partners</h3>
          <div className="space-y-4">
            {matches.matches.map((match, index) => (
              <div key={index} className={`rounded-lg p-4 border ${getSimilarityBg(match.similarityScore)}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">U{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-white">User {match.userId.slice(0, 8)}...</h4>
                      <div className={`text-sm font-medium ${getSimilarityColor(match.similarityScore)}`}>
                        {match.similarityScore}% Match
                      </div>
                    </div>
                  </div>
                  <button className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg text-sm transition-colors">
                    Connect
                  </button>
                </div>
                <div className="ml-13">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {match.reasons.map((reason, idx) => (
                      <span key={idx} className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/80">
                        {reason}
                      </span>
                    ))}
                  </div>
                  <div className="text-white/80 text-sm">
                    <span className="font-medium">Suggested activities:</span> {match.suggestedGroupActivities.join(', ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Group Recommendations */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">📚 Recommended Study Groups</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.groupRecommendations.map((group, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-teal-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">G{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{group.groupName}</h4>
                    <p className="text-white/60 text-sm">{group.matchReason}</p>
                  </div>
                </div>
                <p className="text-white/80 text-sm mb-3">{group.joinInstructions}</p>
                <button className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition-all duration-200">
                  Join Group
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <button
            onClick={findStudyGroupMatches}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200"
          >
            🔄 Refresh Matches
          </button>
        </div>
      </div>
    </div>
  )
}