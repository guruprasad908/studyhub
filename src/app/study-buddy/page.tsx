'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Brain, 
  MessageCircle, 
  BookOpen, 
  Target, 
  Clock,
  Lightbulb,
  TrendingUp,
  Award,
  Sparkles,
  Send,
  RefreshCw,
  User,
  Bot
} from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { aiRoadmapService } from '../../lib/aiService';

export default function StudyBuddyPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [studyGoals, setStudyGoals] = useState<any[]>([]);
  const [studyStreak, setStudyStreak] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check authentication
  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
        return;
      }
      setUser(user);
    } catch (error) {
      console.error('Error checking user:', error);
      router.push('/auth');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  // Initialize chat with welcome message
  useEffect(() => {
    if (user && messages.length === 0) {
      setMessages([{
        id: Date.now(),
        type: 'bot',
        message: `👋 Hi ${user.email?.split('@')[0] || 'there'}! I'm your AI Study Buddy! 

I'm here to help you with:
📚 **Study Questions** - Get explanations on any topic
🎯 **Learning Strategies** - Personalized study methods
💪 **Motivation** - Keep you motivated and focused
🧠 **Concept Clarification** - Break down complex topics
📊 **Progress Tracking** - Monitor your learning journey

What would you like to work on today?`,
        timestamp: new Date()
      }]);
    }
  }, [user]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Enhanced AI response function
  const getAIResponse = async (userMessage: string) => {
    try {
      // Try Ollama first, fall back to template responses
      if (aiRoadmapService.isOllamaAvailable) {
        const response = await fetch('http://localhost:11434/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'llama3.2',
            prompt: `You are a friendly AI Study Buddy helping students learn. Your role is to:
1. Answer study questions clearly and encouragingly
2. Provide helpful explanations with examples
3. Offer study tips and learning strategies
4. Give motivational support
5. Break down complex topics into simple parts

Keep responses concise but helpful. Be encouraging and supportive.

Student question: ${userMessage}

Helpful response:`,
            stream: false
          })
        });

        const result = await response.json();
        return result.response || getTemplateResponse(userMessage);
      } else {
        return getTemplateResponse(userMessage);
      }
    } catch (error) {
      console.error('AI response error:', error);
      return getTemplateResponse(userMessage);
    }
  };

  const getTemplateResponse = (userMessage: string) => {
    const message = userMessage.toLowerCase();

    // Motivational responses
    if (message.includes('tired') || message.includes('frustrated') || message.includes('give up')) {
      const responses = [
        "🌟 I understand studying can be challenging, but remember - every expert was once a beginner! Take a short break, then come back with fresh energy. You've got this! 💪",
        "📚 Feeling overwhelmed is totally normal! Try breaking your study session into smaller 25-minute chunks (Pomodoro technique). Small steps lead to big achievements! 🎯",
        "💫 Remember why you started this learning journey. Every moment you spend studying is an investment in your future self. I believe in you! 🚀"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // Study tips
    if (message.includes('how to study') || message.includes('study tips')) {
      return `📖 Here are my top study strategies:

🎯 **Active Learning**: Don't just read - summarize, teach others, make flashcards
⏰ **Pomodoro Technique**: 25 min focused study + 5 min break
🧠 **Spaced Repetition**: Review material at increasing intervals
📝 **Practice Testing**: Quiz yourself regularly
🎨 **Visual Learning**: Create mind maps and diagrams
👥 **Study Groups**: Explain concepts to others

Which technique would you like to learn more about?`;
    }

    // Subject-specific responses
    if (message.includes('data science') || message.includes('machine learning')) {
      return `🤖 Data Science Learning Path:

**Foundation (2-3 months)**:
📊 Statistics & Probability
🐍 Python Programming (pandas, numpy)
📈 Data Visualization (matplotlib, seaborn)

**Intermediate (3-4 months)**:
🧠 Machine Learning Basics
📊 SQL & Database Management
🔧 Data Preprocessing & Cleaning

**Advanced (4+ months)**:
🤖 Deep Learning (TensorFlow, PyTorch)
☁️ Cloud Platforms (AWS, GCP)
📈 Real-world Projects

Start with Python basics and statistics. What's your current level?`;
    }

    if (message.includes('web development') || message.includes('javascript') || message.includes('react')) {
      return `💻 Web Development Roadmap:

**Frontend Foundation**:
🌐 HTML5 & CSS3
⚡ JavaScript ES6+
📱 Responsive Design

**Modern Frontend**:
⚛️ React.js or Vue.js
🎨 CSS Frameworks (Tailwind)
🔧 Build Tools (Vite, Webpack)

**Full-Stack**:
🖥️ Node.js & Express
💾 Databases (MongoDB, PostgreSQL)
🚀 Deployment (Vercel, Netlify)

Which area interests you most?`;
    }

    if (message.includes('python')) {
      return `🐍 Python Learning Journey:

**Beginner (4-6 weeks)**:
• Variables, data types, loops
• Functions and basic OOP
• File handling and error handling

**Intermediate (6-8 weeks)**:
• Advanced OOP concepts
• Libraries (requests, pandas)
• Web scraping basics

**Advanced Projects**:
• Build web apps with Flask/Django
• Data analysis projects
• Automation scripts

What specific Python topic interests you?`;
    }

    // Default response
    return `🤔 Great question! I'm here to help you learn. 

Try asking me about:
• Study strategies and tips
• Specific subjects (Data Science, Web Dev, Python)
• Motivation and productivity
• Learning techniques
• Career guidance

What would you like to explore? 📚`;
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMsg = {
      id: Date.now(),
      type: 'user',
      message: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Get AI response
    const aiResponse = await getAIResponse(inputMessage);

    // Simulate typing delay
    setTimeout(() => {
      const botMsg = {
        id: Date.now() + 1,
        type: 'bot',
        message: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: Date.now(),
      type: 'bot',
      message: "Chat cleared! 🧹 How can I help you with your studies today?",
      timestamp: new Date()
    }]);
  };

  const quickActions = [
    { label: "Study Tips", message: "How can I study more effectively?" },
    { label: "Motivation", message: "I need some motivation to keep studying" },
    { label: "Data Science", message: "How do I start learning data science?" },
    { label: "Web Development", message: "What should I learn for web development?" },
    { label: "Python Help", message: "Help me learn Python programming" },
    { label: "Time Management", message: "How can I manage my study time better?" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">AI Study Buddy</h1>
              <p className="text-gray-400">Your personal learning assistant</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-900 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'chat' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <MessageCircle className="w-4 h-4 inline mr-2" />
              AI Chat
            </button>
            <button
              onClick={() => setActiveTab('goals')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'goals' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Target className="w-4 h-4 inline mr-2" />
              Study Goals
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'progress' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Progress
            </button>
          </div>
        </div>

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Quick Actions Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-white font-semibold mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => setInputMessage(action.message)}
                      className="w-full text-left p-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors text-sm"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="lg:col-span-3">
              <div className="bg-gray-900 rounded-xl border border-gray-800 h-[600px] flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">AI Study Assistant</h3>
                      <p className="text-gray-400 text-sm">Online and ready to help</p>
                    </div>
                  </div>
                  <button
                    onClick={clearChat}
                    className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
                    title="Clear chat"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start gap-3 max-w-[80%] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          msg.type === 'user' 
                            ? 'bg-blue-600' 
                            : 'bg-gradient-to-br from-purple-500 to-pink-500'
                        }`}>
                          {msg.type === 'user' ? 
                            <User className="w-4 h-4 text-white" /> : 
                            <Bot className="w-4 h-4 text-white" />
                          }
                        </div>
                        <div className={`p-3 rounded-xl ${
                          msg.type === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-800 text-gray-100'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                          <p className="text-xs opacity-60 mt-2">
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-gray-800 p-3 rounded-xl">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-800">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about studying..."
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!inputMessage.trim() || isTyping}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white p-3 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    💡 Try asking about study strategies, specific subjects, or motivation!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-white text-xl font-bold mb-4 flex items-center">
                <Target className="w-6 h-6 mr-3 text-blue-400" />
                Study Goals
              </h3>
              <p className="text-gray-400 mb-6">Set and track your learning objectives</p>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-800 rounded-lg">
                  <h4 className="text-white font-medium">Weekly Goal</h4>
                  <p className="text-gray-400 text-sm">Complete Data Science fundamentals</p>
                  <div className="mt-2 bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full w-3/4"></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">75% complete</p>
                </div>
                
                <div className="p-4 bg-gray-800 rounded-lg">
                  <h4 className="text-white font-medium">Daily Target</h4>
                  <p className="text-gray-400 text-sm">Study for 2 hours</p>
                  <div className="mt-2 bg-gray-700 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full w-full"></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Completed!</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-white text-xl font-bold mb-4 flex items-center">
                <Award className="w-6 h-6 mr-3 text-yellow-400" />
                Achievements
              </h3>
              <p className="text-gray-400 mb-6">Your learning milestones</p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                  <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">First Week Complete</h4>
                    <p className="text-gray-400 text-sm">Consistent daily studying</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Knowledge Seeker</h4>
                    <p className="text-gray-400 text-sm">Asked 50+ questions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-white text-lg font-bold mb-4">Study Streak</h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-400 mb-2">7</div>
                <p className="text-gray-400">Days in a row</p>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-white text-lg font-bold mb-4">Total Study Time</h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">24h</div>
                <p className="text-gray-400">This week</p>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-white text-lg font-bold mb-4">Topics Mastered</h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">12</div>
                <p className="text-gray-400">Concepts learned</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}