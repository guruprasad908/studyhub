'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  Calendar,
  Clock,
  Target,
  Award,
  BookOpen,
  Brain,
  BarChart3,
  PieChart
} from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';

export default function ProgressPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mock data - in a real app, this would come from your database
  const [progressData] = useState({
    weeklyStudyTime: 24,
    totalSessions: 156,
    streak: 7,
    topicsCompleted: 12,
    weeklyProgress: [
      { day: 'Mon', hours: 3.5 },
      { day: 'Tue', hours: 4.2 },
      { day: 'Wed', hours: 2.8 },
      { day: 'Thu', hours: 4.1 },
      { day: 'Fri', hours: 3.9 },
      { day: 'Sat', hours: 2.5 },
      { day: 'Sun', hours: 3.0 }
    ],
    subjectBreakdown: [
      { subject: 'Data Science', percentage: 40, color: 'bg-blue-500' },
      { subject: 'Python', percentage: 30, color: 'bg-green-500' },
      { subject: 'Web Dev', percentage: 20, color: 'bg-purple-500' },
      { subject: 'Math', percentage: 10, color: 'bg-yellow-500' }
    ]
  });

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
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Progress Analytics</h1>
              <p className="text-gray-400">Track your learning journey with AI insights</p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Study Streak</p>
                <p className="text-3xl font-bold text-orange-400">{progressData.streak}</p>
                <p className="text-gray-400 text-sm">days</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">This Week</p>
                <p className="text-3xl font-bold text-blue-400">{progressData.weeklyStudyTime}h</p>
                <p className="text-gray-400 text-sm">study time</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Sessions</p>
                <p className="text-3xl font-bold text-green-400">{progressData.totalSessions}</p>
                <p className="text-gray-400 text-sm">completed</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Topics Mastered</p>
                <p className="text-3xl font-bold text-purple-400">{progressData.topicsCompleted}</p>
                <p className="text-gray-400 text-sm">concepts</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Progress Chart */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h3 className="text-white text-xl font-bold mb-6 flex items-center">
              <BarChart3 className="w-6 h-6 mr-3 text-blue-400" />
              Weekly Study Hours
            </h3>
            <div className="space-y-4">
              {progressData.weeklyProgress.map((day, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-12 text-gray-400 text-sm font-medium">{day.day}</div>
                  <div className="flex-1 bg-gray-800 rounded-full h-3 relative">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(day.hours / 5) * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-12 text-white text-sm font-medium text-right">{day.hours}h</div>
                </div>
              ))}
            </div>
          </div>

          {/* Subject Breakdown */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h3 className="text-white text-xl font-bold mb-6 flex items-center">
              <PieChart className="w-6 h-6 mr-3 text-green-400" />
              Study Focus Areas
            </h3>
            <div className="space-y-4">
              {progressData.subjectBreakdown.map((subject, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 font-medium">{subject.subject}</span>
                    <span className="text-gray-400 text-sm">{subject.percentage}%</span>
                  </div>
                  <div className="bg-gray-800 rounded-full h-2">
                    <div 
                      className={`${subject.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${subject.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h3 className="text-white text-xl font-bold mb-6 flex items-center">
              <Brain className="w-6 h-6 mr-3 text-purple-400" />
              AI Insights
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
                <p className="text-blue-300 font-medium mb-2">📈 Great Progress!</p>
                <p className="text-gray-300 text-sm">
                  You're studying 20% more than last week. Your consistency in Data Science 
                  is paying off!
                </p>
              </div>
              <div className="p-4 bg-yellow-900/20 border border-yellow-800 rounded-lg">
                <p className="text-yellow-300 font-medium mb-2">💡 Optimization Tip</p>
                <p className="text-gray-300 text-sm">
                  Consider increasing your Python practice time. Based on your goals, 
                  2-3 more hours per week would accelerate your progress.
                </p>
              </div>
              <div className="p-4 bg-green-900/20 border border-green-800 rounded-lg">
                <p className="text-green-300 font-medium mb-2">🎯 Next Milestone</p>
                <p className="text-gray-300 text-sm">
                  You're 80% towards your monthly goal. Keep up the momentum!
                </p>
              </div>
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h3 className="text-white text-xl font-bold mb-6 flex items-center">
              <Award className="w-6 h-6 mr-3 text-yellow-400" />
              Recent Achievements
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-gray-800 rounded-lg">
                <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Week Warrior</h4>
                  <p className="text-gray-400 text-sm">7 consecutive days of studying</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-3 bg-gray-800 rounded-lg">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Knowledge Seeker</h4>
                  <p className="text-gray-400 text-sm">Completed 10 Data Science topics</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-3 bg-gray-800 rounded-lg">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Focus Master</h4>
                  <p className="text-gray-400 text-sm">50 Pomodoro sessions completed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}