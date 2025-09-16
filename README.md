# 📚 StudyHub - Your Complete Free Study Companion

**Beat procrastination and achieve your study goals with our beautifully designed, completely free study platform.**

![StudyHub](https://img.shields.io/badge/StudyHub-Free%20Forever-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Supabase-2.57.4-green)

## ✨ Features

### 🎯 **Three Clean Study Environments**
- **🏠 Home Dashboard**: Clean navigation between all study tools
- **⚡ Today's Focus**: Anti-procrastination daily task management
- **📋 Study Roadmap**: Long-term goal planning and tracking
- **📊 Analytics Dashboard**: Progress visualization and insights

### 🍅 **Anti-Procrastination Tools**
- **Pomodoro Timer**: 25-minute focused work sessions
- **Task Breakdown**: Break large goals into manageable chunks
- **Daily Motivation**: Inspirational quotes and focus tips
- **Progress Tracking**: Visual progress bars to maintain motivation
- **Streak Tracking**: Build consistent study habits

### 📊 **Analytics & Insights**
- **Weekly Study Charts**: Visual representation of study hours
- **Subject Distribution**: See time allocation across different topics
- **Consistency Tracking**: Monitor your study consistency percentage
- **Goal Progress**: Track completion rates for all study goals

### 🎨 **Beautiful Design**
- **Glass-morphism UI**: Modern, professional interface
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark Theme**: Easy on the eyes for long study sessions
- **Smooth Animations**: Delightful user experience

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn
- Supabase account (free)

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd prep-hub
npm install
```

### 2. Setup Database
1. Create a free account at [Supabase](https://supabase.com)
2. Create a new project
3. Go to SQL Editor and run the complete setup script:
```sql
-- Copy and paste the contents of database/complete_setup.sql
-- This creates all necessary tables, RLS policies, and indexes
```

### 3. Environment Configuration
```bash
# Copy the example environment file
cp .env.local.example .env.local

# Edit .env.local and add your Supabase credentials:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` and start studying! 🎉

## 🏗️ Project Structure

```
prep-hub/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── auth/              # Authentication page
│   │   ├── today/             # Daily task management
│   │   ├── roadmap/           # Long-term goal planning
│   │   ├── dashboard/         # Analytics & insights
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/           # Reusable UI components
│   │   ├── WeeklyChart.tsx   # Study hours visualization
│   │   ├── TaskPieChart.tsx  # Subject distribution chart
│   │   ├── PomodoroTimer.jsx # Focus timer component
│   │   └── ...               # Other components
│   ├── lib/                  # Utilities
│   │   └── supabaseClient.ts # Database client
│   └── types.ts             # TypeScript type definitions
├── database/                # Database setup scripts
│   ├── complete_setup.sql   # Full database initialization
│   └── today_tasks_schema.sql # Daily tasks table
├── .env.local.example      # Environment variables template
└── README.md              # This file
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.5.3** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 3.4.15** - Styling framework
- **Lucide React** - Beautiful icons
- **Recharts 3.2.0** - Data visualization

### Backend
- **Supabase** - PostgreSQL database with real-time features
- **Row Level Security** - Secure user data isolation
- **Authentication** - Built-in user management

### Development
- **ESLint 9** - Code linting
- **PostCSS** - CSS processing
- **Turbopack** - Fast development builds

## 📱 Pages Overview

### 🏠 **Home Page**
- Clean navigation dashboard
- Welcome message and platform overview
- Quick access to all study environments
- User authentication status

### ⚡ **Today's Focus** (`/today`)
- Daily task management with priorities
- Built-in Pomodoro timer (25-min sessions)
- Real-time progress tracking
- Anti-procrastination motivational quotes
- Task completion statistics

### 📋 **Study Roadmap** (`/roadmap`)
- Long-term study goal planning
- Progress visualization with charts
- Goal creation and management
- Study hour tracking and targets

### 📊 **Analytics Dashboard** (`/dashboard`)
- Weekly study hour visualization
- Subject-wise time distribution
- Consistency tracking and streaks
- Quick session logging
- Comprehensive progress insights

### 🔐 **Authentication** (`/auth`)
- Clean sign-up/sign-in interface
- Email/password authentication
- Magic link support
- Secure user session management

## 🌟 Key Features in Detail

### Anti-Procrastination System
- **Pomodoro Technique**: 25-minute focused work sessions with 5-minute breaks
- **Task Chunking**: Break large goals into smaller, manageable tasks
- **Visual Progress**: See your advancement with beautiful progress bars
- **Motivational Quotes**: Daily inspiration to keep you focused
- **Streak Tracking**: Build momentum with consecutive study days

### Study Analytics
- **Weekly Charts**: Visualize your study patterns over time
- **Subject Distribution**: Understand how you allocate time across topics
- **Consistency Metrics**: Track your study habit consistency
- **Goal Progress**: Monitor completion rates for all objectives

### User Experience
- **Responsive Design**: Perfect experience on any device
- **Glass-morphism UI**: Modern, professional interface
- **Smooth Animations**: Delightful interactions throughout
- **Intuitive Navigation**: Easy movement between study environments

## 🔒 Security & Privacy

- **Row Level Security**: Your data is completely private and secure
- **User Isolation**: Each user can only access their own data
- **Secure Authentication**: Industry-standard user authentication
- **Data Privacy**: No tracking, no ads, completely free forever

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel
```

### Other Platforms
The app can be deployed to any platform that supports Node.js:
- Netlify
- Railway
- Heroku
- Self-hosted

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with love for students who want to beat procrastination
- Inspired by the Pomodoro Technique
- Designed for focus, simplicity, and effectiveness

---

**Start your focused study journey today with StudyHub - completely free, forever! 📚✨**

For support or questions, please open an issue in this repository.