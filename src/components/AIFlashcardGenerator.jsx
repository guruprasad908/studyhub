// AI-Powered Flashcard Generator Component
'use client'

import { useState, useEffect } from 'react'
import { aiRoadmapService } from '../lib/aiService'

export default function AIFlashcardGenerator({ 
  user, 
  selectedTopic, 
  onFlashcardsGenerated 
}) {
  const [inputText, setInputText] = useState('')
  const [flashcards, setFlashcards] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [aiStatus, setAiStatus] = useState('Checking AI availability...')

  useEffect(() => {
    checkAIStatus()
    if (selectedTopic) {
      setInputText(selectedTopic)
    }
  }, [selectedTopic])

  const checkAIStatus = async () => {
    await aiRoadmapService.checkOllamaAvailability()
    setAiStatus(aiRoadmapService.isOllamaAvailable ? 
      '🤖 Local AI Ready (Ollama)' : '📝 Template-based Generation Ready')
  }

  const generateFlashcards = async () => {
    if (!inputText.trim()) return

    setLoading(true)
    try {
      const cards = await aiRoadmapService.generateFlashcards(inputText)
      setFlashcards(cards)
      setCurrentCardIndex(0)
      setIsFlipped(false)
      if (onFlashcardsGenerated) {
        onFlashcardsGenerated(cards)
      }
    } catch (error) {
      console.error('Error generating flashcards:', error)
      alert('Error generating flashcards. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const nextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setIsFlipped(false)
    }
  }

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
      setIsFlipped(false)
    }
  }

  const flipCard = () => {
    setIsFlipped(!isFlipped)
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="text-2xl">🧠</span>
          AI Flashcard Generator
        </h2>
        <div className="text-sm text-white/60">{aiStatus}</div>
      </div>

      {/* Input Section */}
      <div className="mb-6">
        <label className="block text-white/80 text-sm font-medium mb-2">
          Enter topic or paste study material:
        </label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 h-32 resize-none"
          placeholder="Paste your notes, textbook content, or enter a topic like 'Machine Learning Algorithms'..."
        />
        <button
          onClick={generateFlashcards}
          disabled={loading || !inputText.trim()}
          className="mt-3 w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Flashcards...
            </div>
          ) : (
            '✨ Generate AI Flashcards'
          )}
        </button>
      </div>

      {/* Flashcards Display */}
      {flashcards.length > 0 && (
        <div className="space-y-6">
          <div className="text-center text-white/60 text-sm">
            {currentCardIndex + 1} of {flashcards.length} flashcards
          </div>

          {/* Flashcard */}
          <div 
            className="relative h-64 cursor-pointer perspective-1000"
            onClick={flipCard}
          >
            <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
              isFlipped ? 'rotate-y-180' : ''
            }`}>
              {/* Front of card */}
              <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 flex flex-col justify-center items-center shadow-xl">
                <div className="text-white/80 text-sm mb-2">Question</div>
                <div className="text-white text-xl font-medium text-center">
                  {flashcards[currentCardIndex]?.question}
                </div>
                <div className="absolute bottom-4 text-white/60 text-sm">
                  Click to flip
                </div>
              </div>

              {/* Back of card */}
              <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-green-600 to-teal-600 rounded-2xl p-6 flex flex-col justify-center items-center shadow-xl rotate-y-180">
                <div className="text-white/80 text-sm mb-2">Answer</div>
                <div className="text-white text-xl font-medium text-center">
                  {flashcards[currentCardIndex]?.answer}
                </div>
                <div className="absolute bottom-4 text-white/60 text-sm">
                  Click to flip back
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevCard}
              disabled={currentCardIndex === 0}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              ← Previous
            </button>
            
            <div className="flex gap-2">
              {flashcards.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === currentCardIndex ? 'bg-purple-400' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={nextCard}
              disabled={currentCardIndex === flashcards.length - 1}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              Next →
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-2 px-4 rounded-lg transition-colors">
              📥 Save Flashcards
            </button>
            <button className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white py-2 px-4 rounded-lg transition-colors">
              📤 Export as CSV
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {flashcards.length === 0 && !loading && (
        <div className="text-center py-8">
          <div className="text-5xl mb-4">🃏</div>
          <h3 className="text-xl font-semibold text-white mb-2">Generate AI Flashcards</h3>
          <p className="text-white/60">
            Enter study material above to create smart flashcards powered by AI
          </p>
        </div>
      )}
    </div>
  )
}