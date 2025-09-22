// AI-Powered Note Assistant Component
'use client'

import { useState, useEffect } from 'react'
import { aiRoadmapService } from '../lib/aiService'

export default function AINoteAssistant({ 
  user, 
  initialContent = '',
  onNotesProcessed 
}) {
  const [inputText, setInputText] = useState(initialContent)
  const [processedNotes, setProcessedNotes] = useState(null)
  const [activeTab, setActiveTab] = useState('original')
  const [loading, setLoading] = useState(false)
  const [aiStatus, setAiStatus] = useState('Checking AI availability...')

  useEffect(() => {
    checkAIStatus()
  }, [])

  const checkAIStatus = async () => {
    await aiRoadmapService.checkOllamaAvailability()
    setAiStatus(aiRoadmapService.isOllamaAvailable ? 
      '🤖 Local AI Ready (Ollama)' : '📝 Template-based Processing Ready')
  }

  const processNotes = async () => {
    if (!inputText.trim()) return

    setLoading(true)
    try {
      const notes = await aiRoadmapService.processNotes(inputText)
      setProcessedNotes(notes)
      setActiveTab('summary')
      if (onNotesProcessed) {
        onNotesProcessed(notes)
      }
    } catch (error) {
      console.error('Error processing notes:', error)
      alert('Error processing notes. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const exportNotes = (format) => {
    let content = '';
    let filename = 'notes';
    
    switch (format) {
      case 'summary':
        content = processedNotes?.summary || '';
        filename = 'summary.txt';
        break;
      case 'keypoints':
        content = processedNotes?.keyPoints?.join('\n') || '';
        filename = 'key_points.txt';
        break;
      case 'mindmap':
        content = processedNotes?.mindMap?.text || '';
        filename = 'mind_map.txt';
        break;
      case 'original':
      default:
        content = inputText;
        filename = 'original_notes.txt';
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🧠</span>
            AI Note Assistant
          </h2>
          <div className="text-sm text-white/60">{aiStatus}</div>
        </div>

        <div className="mb-6">
          <label className="block text-white/80 text-sm font-medium mb-2">
            Paste your notes or study material:
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 h-48 resize-none"
            placeholder="Paste your lecture notes, textbook content, or any study material here..."
          />
          <button
            onClick={processNotes}
            disabled={loading || !inputText.trim()}
            className="mt-3 w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Notes with AI...
              </div>
            ) : (
              '✨ Process with AI Assistant'
            )}
          </button>
        </div>
      </div>

      {processedNotes && (
        <>
          {/* Tab Navigation */}
          <div className="border-t border-white/20">
            <div className="flex">
              <button
                onClick={() => setActiveTab('original')}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === 'original' 
                    ? 'text-white bg-white/10' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                Original
              </button>
              <button
                onClick={() => setActiveTab('summary')}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === 'summary' 
                    ? 'text-white bg-white/10' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                Summary
              </button>
              <button
                onClick={() => setActiveTab('keypoints')}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === 'keypoints' 
                    ? 'text-white bg-white/10' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                Key Points
              </button>
              <button
                onClick={() => setActiveTab('mindmap')}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === 'mindmap' 
                    ? 'text-white bg-white/10' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                Mind Map
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'original' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Original Notes</h3>
                  <button
                    onClick={() => exportNotes('original')}
                    className="text-sm bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg transition-colors"
                  >
                    📥 Export
                  </button>
                </div>
                <div className="bg-white/5 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <pre className="text-white/90 whitespace-pre-wrap font-sans">
                    {inputText}
                  </pre>
                </div>
              </div>
            )}

            {activeTab === 'summary' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">AI-Generated Summary</h3>
                  <button
                    onClick={() => exportNotes('summary')}
                    className="text-sm bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg transition-colors"
                  >
                    📥 Export
                  </button>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-white/90 whitespace-pre-wrap">
                    {processedNotes.summary}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'keypoints' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Key Points</h3>
                  <button
                    onClick={() => exportNotes('keypoints')}
                    className="text-sm bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg transition-colors"
                  >
                    📥 Export
                  </button>
                </div>
                <div className="space-y-3">
                  {processedNotes.keyPoints.map((point, index) => (
                    <div key={index} className="flex items-start gap-3 bg-white/5 rounded-lg p-4">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                      <p className="text-white/90">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'mindmap' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Concept Map</h3>
                  <button
                    onClick={() => exportNotes('mindmap')}
                    className="text-sm bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg transition-colors"
                  >
                    📥 Export
                  </button>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <pre className="text-white/90 whitespace-pre-wrap font-sans">
                    {processedNotes.mindMap.text}
                  </pre>
                  <div className="mt-4 text-sm text-white/60">
                    {processedNotes.mindMap.description}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {!processedNotes && !loading && (
        <div className="p-12 text-center">
          <div className="text-5xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-white mb-2">AI Note Assistant</h3>
          <p className="text-white/60 max-w-md mx-auto">
            Paste your study notes to get AI-powered summarization, key points extraction, and concept mapping
          </p>
        </div>
      )}
    </div>
  )
}