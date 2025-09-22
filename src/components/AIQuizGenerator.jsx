// AI-Powered Quiz Generator Component
'use client'

import { useState, useEffect } from 'react'
import { aiRoadmapService } from '../lib/aiService'

export default function AIQuizGenerator({ 
  user, 
  selectedTopic,
  onQuizGenerated 
}) {
  const [inputText, setInputText] = useState('')
  const [quiz, setQuiz] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)
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

  const generateQuiz = async () => {
    if (!inputText.trim()) return

    setLoading(true)
    try {
      const generatedQuiz = await aiRoadmapService.generateQuiz(inputText)
      setQuiz(generatedQuiz)
      setCurrentQuestionIndex(0)
      setSelectedAnswers({})
      setShowResults(false)
      if (onQuizGenerated) {
        onQuizGenerated(generatedQuiz)
      }
    } catch (error) {
      console.error('Error generating quiz:', error)
      alert('Error generating quiz. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }))
  }

  const submitQuiz = () => {
    setShowResults(true)
  }

  const restartQuiz = () => {
    setQuiz(null)
    setCurrentQuestionIndex(0)
    setSelectedAnswers({})
    setShowResults(false)
  }

  const getAnswerClass = (questionIndex, answerIndex, correctAnswerIndex) => {
    if (!showResults) {
      return selectedAnswers[questionIndex] === answerIndex 
        ? 'bg-blue-500 text-white' 
        : 'bg-white/10 hover:bg-white/20';
    }

    if (answerIndex === correctAnswerIndex) {
      return 'bg-green-500 text-white';
    } else if (selectedAnswers[questionIndex] === answerIndex) {
      return 'bg-red-500 text-white';
    }
    return 'bg-white/10';
  }

  if (quiz) {
    const currentQuestion = quiz.questions[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100
    
    if (showResults) {
      const correctAnswers = quiz.questions.filter((q, index) => 
        selectedAnswers[index] === q.correctAnswer
      ).length
      const score = Math.round((correctAnswers / quiz.questions.length) * 100)

      return (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6">Quiz Results</h2>
          
          <div className="text-center mb-8">
            <div className="text-5xl font-bold mb-2">
              {score}%
            </div>
            <div className="text-white/80">
              {correctAnswers} out of {quiz.questions.length} correct
            </div>
            
            <div className="mt-4">
              <div className="w-full bg-white/20 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-1000"
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            {quiz.questions.map((question, qIndex) => (
              <div key={qIndex} className="bg-white/5 rounded-lg p-4">
                <h3 className="text-white font-medium mb-3">
                  {qIndex + 1}. {question.question}
                </h3>
                
                <div className="space-y-2">
                  {question.options.map((option, oIndex) => (
                    <div 
                      key={oIndex}
                      className={`p-3 rounded-lg ${
                        oIndex === question.correctAnswer 
                          ? 'bg-green-500/20 border border-green-500/30' 
                          : selectedAnswers[qIndex] === oIndex
                          ? 'bg-red-500/20 border border-red-500/30'
                          : 'bg-white/5'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                          oIndex === question.correctAnswer 
                            ? 'bg-green-500 text-white'
                            : selectedAnswers[qIndex] === oIndex
                            ? 'bg-red-500 text-white'
                            : 'bg-white/20'
                        }`}>
                          {oIndex === question.correctAnswer && '✓'}
                          {selectedAnswers[qIndex] === oIndex && oIndex !== question.correctAnswer && '✗'}
                        </div>
                        <span className={selectedAnswers[qIndex] === oIndex && oIndex !== question.correctAnswer ? 'line-through' : ''}>
                          {option}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {question.explanation && (
                  <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="text-blue-300 text-sm font-medium mb-1">Explanation:</div>
                    <div className="text-white/90 text-sm">{question.explanation}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex gap-3 mt-6">
            <button
              onClick={restartQuiz}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              🔄 Try Again
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{quiz.title}</h2>
          <div className="text-sm text-white/60">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </div>
        </div>
        
        <div className="mb-4">
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            {currentQuestion.question}
          </h3>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(currentQuestionIndex, index)}
                className={`w-full text-left p-4 rounded-lg transition-colors ${
                  getAnswerClass(currentQuestionIndex, index, currentQuestion.correctAnswer)
                }`}
              >
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3">
                    {selectedAnswers[currentQuestionIndex] === index && (
                      <div className="w-3 h-3 rounded-full bg-current"></div>
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white rounded-lg transition-colors"
          >
            ← Previous
          </button>
          
          {currentQuestionIndex < quiz.questions.length - 1 ? (
            <button
              onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
              disabled={selectedAnswers[currentQuestionIndex] === undefined}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
            >
              Next Question →
            </button>
          ) : (
            <button
              onClick={submitQuiz}
              disabled={selectedAnswers[currentQuestionIndex] === undefined}
              className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
            >
              Submit Quiz
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="text-2xl">🧠</span>
          AI Quiz Generator
        </h2>
        <div className="text-sm text-white/60">{aiStatus}</div>
      </div>

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
          onClick={generateQuiz}
          disabled={loading || !inputText.trim()}
          className="mt-3 w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Quiz...
            </div>
          ) : (
            '✨ Generate AI Quiz'
          )}
        </button>
      </div>

      <div className="text-center py-8">
        <div className="text-5xl mb-4">❓</div>
        <h3 className="text-xl font-semibold text-white mb-2">Test Your Knowledge</h3>
        <p className="text-white/60">
          Enter study material above to create a personalized quiz powered by AI
        </p>
      </div>
    </div>
  )
}