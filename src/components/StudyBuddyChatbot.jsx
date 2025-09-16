// AI Study Buddy Chatbot Component
'use client'

import { useState, useEffect, useRef } from 'react'
import { aiRoadmapService } from '../lib/aiService'

export default function StudyBuddyChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [chatMode, setChatMode] = useState('general') // general, subject-specific, motivational
  const [currentSubject, setCurrentSubject] = useState('')
  const messagesEndRef = useRef(null)

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: Date.now(),
        type: 'bot',
        message: "👋 Hi! I'm your AI Study Buddy! I'm here to help you with:\n\n📚 Study questions & explanations\n🎯 Learning tips & strategies\n💪 Motivation & encouragement\n🧠 Concept clarification\n\nWhat would you like to study today?",
        timestamp: new Date()
      }])
    }
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Enhanced AI chat service
  const getAIResponse = async (userMessage, context = {}) => {
    try {
      // Check if Ollama is available for more intelligent responses
      if (aiRoadmapService.isOllamaAvailable) {
        return await getOllamaResponse(userMessage, context)
      } else {
        return await getTemplateResponse(userMessage, context)
      }
    } catch (error) {
      console.error('AI response error:', error)
      return getFallbackResponse(userMessage)
    }
  }

  // Ollama-based intelligent responses
  const getOllamaResponse = async (userMessage, context) => {
    const systemPrompt = `You are a friendly AI Study Buddy helping students learn. Your role is to:
1. Answer study questions clearly and encouragingly
2. Provide helpful explanations and examples
3. Offer study tips and learning strategies
4. Give motivational support
5. Break down complex topics into simple parts

Keep responses concise but helpful. Be encouraging and supportive.
${context.subject ? `Current subject context: ${context.subject}` : ''}
${context.chatMode === 'motivational' ? 'Focus on motivation and encouragement.' : ''}`

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2',
        prompt: `${systemPrompt}

Student question: ${userMessage}

Helpful response:`,
        stream: false
      })
    })

    const result = await response.json()
    return result.response || getFallbackResponse(userMessage)
  }

  // Template-based responses (always available)
  const getTemplateResponse = (userMessage, context) => {
    const message = userMessage.toLowerCase()

    // Motivational responses
    if (message.includes('tired') || message.includes('frustrated') || message.includes('give up')) {
      return getMotivationalResponse()
    }

    // Study strategy questions
    if (message.includes('how to study') || message.includes('study tips')) {
      return getStudyTipsResponse()
    }

    // Subject-specific responses
    if (message.includes('data science') || message.includes('machine learning')) {
      return getDataScienceResponse(userMessage)
    }

    if (message.includes('web development') || message.includes('javascript') || message.includes('react')) {
      return getWebDevResponse(userMessage)
    }

    if (message.includes('python')) {
      return getPythonResponse(userMessage)
    }

    // Pomodoro and productivity
    if (message.includes('pomodoro') || message.includes('focus') || message.includes('productive')) {
      return getProductivityResponse()
    }

    // General study questions
    if (message.includes('?')) {
      return getGeneralStudyResponse(userMessage)
    }

    // Default encouraging response
    return getEncouragingResponse(userMessage)
  }

  const getMotivationalResponse = () => {
    const responses = [
      "🌟 I understand studying can be challenging, but remember - every expert was once a beginner! Take a short break, then come back with fresh energy. You've got this! 💪",
      "📚 Feeling overwhelmed is totally normal! Try breaking your study session into smaller 25-minute chunks (Pomodoro technique). Small steps lead to big achievements! 🎯",
      "💫 Remember why you started this learning journey. Every moment you spend studying is an investment in your future self. I believe in you! 🚀",
      "🎯 Progress isn't always linear. Some days are harder than others, but consistency beats perfection. Keep showing up - you're doing better than you think! ⭐"
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const getStudyTipsResponse = () => {
    return `📖 Here are my top study strategies:

🎯 **Active Learning**: Don't just read - summarize, teach others, make flashcards
⏰ **Pomodoro Technique**: 25 min focused study + 5 min break
🧠 **Spaced Repetition**: Review material at increasing intervals
💡 **Feynman Technique**: Explain concepts in simple terms
📝 **Practice Testing**: Quiz yourself regularly
🏃‍♂️ **Take Breaks**: Your brain needs rest to consolidate information

What subject are you studying? I can give more specific tips! 🤔`
  }

  const getDataScienceResponse = (userMessage) => {
    if (userMessage.includes('start') || userMessage.includes('begin')) {
      return `🔬 **Data Science Learning Path:**

1️⃣ **Math Foundation**: Statistics, linear algebra basics
2️⃣ **Python**: Pandas, NumPy, Matplotlib
3️⃣ **Data Analysis**: Cleaning, EDA, visualization
4️⃣ **Machine Learning**: Scikit-learn, algorithms
5️⃣ **Projects**: Build portfolio projects

**Today's tip**: Start with Python basics and work with real datasets! 📊`
    }

    return `🔬 Data Science is exciting! Key areas to focus on:
• **Statistics** - Foundation for everything
• **Python/R** - Your main tools
• **SQL** - For data extraction
• **Visualization** - Tell stories with data

What specific area would you like help with? 📊`
  }

  const getWebDevResponse = (userMessage) => {
    return `💻 **Web Development Path:**

🎨 **Frontend**: HTML → CSS → JavaScript → React
⚙️ **Backend**: Node.js → Express → Databases
🛠️ **Tools**: Git, VS Code, Chrome DevTools

**Pro tip**: Build projects while learning - start with a simple portfolio website! 🚀

Need help with any specific technology? 🤔`
  }

  const getPythonResponse = (userMessage) => {
    return `🐍 **Python Learning Strategy:**

1️⃣ **Basics**: Variables, loops, functions
2️⃣ **Data Structures**: Lists, dictionaries, sets
3️⃣ **Libraries**: Requests, Pandas, NumPy
4️⃣ **Projects**: Build something you're interested in!

**Practice tip**: Code for 30 minutes daily, even small programs help! 💻`
  }

  const getProductivityResponse = () => {
    return `⏰ **Pomodoro Technique for Maximum Focus:**

🍅 **25 minutes**: Deep focus, no distractions
☕ **5 minutes**: Short break (stretch, water)
🔄 **Repeat**: 3-4 cycles
🎉 **Long break**: 15-30 minutes after 4 cycles

**Pro tips**: 
• Turn off notifications
• Use StudyHub's built-in timer!
• Celebrate small wins 🎯`
  }

  const getGeneralStudyResponse = (userMessage) => {
    return `🤔 Great question! Here's my take:

While I don't have all the specific details, I'd suggest:
• Breaking down the problem into smaller parts
• Looking for patterns or examples
• Practicing with similar problems
• Teaching the concept to someone else

What subject is this for? I can provide more targeted help! 📚`
  }

  const getEncouragingResponse = (userMessage) => {
    const responses = [
      "That's an interesting topic! 🧠 What specific aspect would you like to explore?",
      "I'm here to help! 📚 Can you tell me more about what you're studying?",
      "Great question! 🎯 Let me help you break that down.",
      "I love your curiosity! 🌟 What would you like to learn about?"
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const getFallbackResponse = (userMessage) => {
    return `🤖 I'm having trouble connecting to my advanced AI right now, but I'm still here to help! 

Try asking me about:
• Study strategies and tips
• Specific subjects (Data Science, Web Dev, Python)
• Motivation and productivity
• Learning techniques

What would you like to explore? 📚`
  }

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMsg = {
      id: Date.now(),
      type: 'user',
      message: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMsg])
    setInputMessage('')
    setIsTyping(true)

    // Get AI response
    const context = { subject: currentSubject, chatMode }
    const aiResponse = await getAIResponse(inputMessage, context)

    // Simulate typing delay
    setTimeout(() => {
      const botMsg = {
        id: Date.now() + 1,
        type: 'bot',
        message: aiResponse,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMsg])
      setIsTyping(false)
    }, 1000)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([{
      id: Date.now(),
      type: 'bot',
      message: "Chat cleared! 🧹 How can I help you with your studies today?",
      timestamp: new Date()
    }])
  }

  const quickActions = [
    { label: "Study Tips", action: () => setInputMessage("How can I study more effectively?") },
    { label: "Motivation", action: () => setInputMessage("I need some motivation to keep studying") },
    { label: "Data Science", action: () => setInputMessage("How do I start learning data science?") },
    { label: "Web Development", action: () => setInputMessage("What should I learn for web development?") },
    { label: "Python Help", action: () => setInputMessage("Help me learn Python programming") }
  ]

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-4 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110"
        >
          <div className="flex items-center justify-center">
            <span className="text-2xl">🤖</span>
          </div>
        </button>
        <div className="absolute -top-12 right-0 bg-black/80 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
          AI Study Buddy
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
            <span className="text-xl">🤖</span>
          </div>
          <div>
            <h3 className="text-white font-semibold">AI Study Buddy</h3>
            <p className="text-white/60 text-xs">Always here to help! 📚</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={clearChat}
            className="text-white/60 hover:text-white p-1 transition-colors"
            title="Clear chat"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/60 hover:text-white p-1 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-3 border-b border-white/10">
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="text-xs bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded-full transition-colors"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.type === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'bg-white/10 text-white'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
              <p className="text-xs opacity-60 mt-1">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/10 text-white p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/20">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about studying..."
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 text-white p-2 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-white/40 mt-2">
          💡 Tip: Ask about study strategies, specific subjects, or motivation!
        </p>
      </div>
    </div>
  )
}