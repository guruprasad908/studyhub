# StudyHub - Hackathon Quick Start Guide

Welcome to StudyHub! This guide will help you quickly understand, run, and explore our AI-powered study companion.

## 🚀 Quick Setup

### Prerequisites
- Node.js 18+ or 20+
- Git
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/guruprasad908/studyhub.git
cd studyhub

# Install dependencies
npm install

# Run the development server
npm run dev
```

Visit `http://localhost:3000` to see the application running!

## 🎯 Key Features to Explore

### 1. **AI Study Buddy Chatbot**
- Located in the bottom right corner (🤖 icon)
- Ask questions about study techniques, specific subjects, or motivation
- Try: "How can I study more effectively?" or "Help me learn Python"

### 2. **Smart Pomodoro AI Coach**
- Access via "Focus Coach" in the main navigation
- Features adaptive timing and AI-powered coaching messages
- Try starting a session and see the AI insights

### 3. **AI Roadmap Generator**
- Access via "Roadmap" in the main navigation
- Click "🤖 AI Roadmap" to generate a personalized learning path
- Try: "Data Scientist", "Web Developer", or "Python Expert"

### 4. **Dashboard Analytics**
- Home page shows comprehensive study analytics
- Includes weekly charts, subject distribution, and consistency tracking

### 5. **Today's Tasks**
- Daily task management with priority levels
- Integrated Pomodoro timer for focused work sessions

## 🔧 Technical Highlights

### Architecture
- **Next.js 15** with App Router for modern React development
- **Supabase** for backend services (authentication, database)
- **TypeScript** for type safety
- **Tailwind CSS** for responsive styling

### AI Integration
- **Ollama** support for local AI models (llama3.2)
- **Template-based fallbacks** for consistent experience without local AI
- **Context-aware responses** based on study subject and user progress

### Key Components
1. `src/components/StudyBuddyChatbot.jsx` - AI chat interface
2. `src/components/SmartPomodoroAICoach.jsx` - Adaptive focus timer
3. `src/components/AIRoadmapGenerator.jsx` - Personalized learning paths
4. `src/app/dashboard/page.tsx` - Analytics dashboard
5. `src/app/today/page.tsx` - Daily task management

## 🎨 UI/UX Features

### Minimal Dark Theme
- Professional, distraction-free interface
- Consistent design language across all pages
- Responsive layout for all device sizes

### Navigation
- Clean sidebar navigation
- Intuitive page organization
- Quick access to all study tools

## 🛠️ Recent Improvements

### Stability Enhancements
- Fixed unhandled promise rejections that caused crashes
- Improved error handling throughout the application
- Enhanced authentication reliability

### Performance Optimizations
- Optimized data fetching patterns
- Better resource management
- Improved loading states

## 🧪 Testing the Application

### Demo Credentials
For quick testing without sign-up:
- Email: `demo@studyhub.com`
- Password: `Demo123!`

### Key User Flows to Test
1. **User Registration/Login** - Authentication flow
2. **AI Chat Interaction** - Ask the Study Buddy questions
3. **Pomodoro Session** - Start a focus timer
4. **Roadmap Generation** - Create a learning path
5. **Task Management** - Add and complete daily tasks
6. **Analytics Review** - Check dashboard insights

## 📁 Project Structure

```
studyhub/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── dashboard/      # Analytics dashboard
│   │   ├── today/          # Daily task management
│   │   ├── roadmap/        # Study roadmap planning
│   │   ├── study-buddy/    # AI chatbot interface
│   │   ├── pomodoro-coach/ # Smart Pomodoro AI Coach
│   │   ├── progress/       # Progress tracking
│   │   └── auth/           # Authentication
│   ├── components/         # Reusable UI components
│   └── lib/                # Services and utilities
├── lib/                    # Supabase client
└── database/              # Database setup scripts
```

## 🚀 Deployment Ready

The application is configured for easy deployment to Vercel:
- Environment variables support
- Optimized build process
- Production-ready configuration

## 🤝 Need Help?

During the hackathon, if you need any assistance with:
- Running the application
- Understanding the codebase
- Exploring features
- Technical questions

Please reach out to our team! We're here to help you succeed.

## 🌟 What Makes StudyHub Special

1. **AI-First Approach**: Every feature enhanced with AI capabilities
2. **Anti-Procrastination Focus**: Specifically designed to combat study challenges
3. **Complete Solution**: All study tools in one integrated platform
4. **Production Ready**: Recent stability improvements make it hackathon-ready
5. **Free Forever**: No premium features or paywalls

Enjoy exploring StudyHub, and we're excited to see what you build! 🚀📚