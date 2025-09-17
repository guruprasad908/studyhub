'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Timer, Play, Pause, RotateCcw, Brain, TrendingUp } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';

export default function PomodoroCoachPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isBreak, setIsBreak] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);

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

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer finished
      setIsRunning(false);
      if (!isBreak) {
        setCompletedPomodoros(prev => prev + 1);
        setTimeLeft(5 * 60); // 5 minute break
        setIsBreak(true);
        // Could add notification here
      } else {
        setTimeLeft(25 * 60); // Back to 25 minutes
        setIsBreak(false);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isBreak]);

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <Timer className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Focus Coach</h1>
              <p className="text-gray-400">Smart break timing and focus optimization</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pomodoro Timer */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-8">
            <div className="text-center">
              <h2 className="text-xl font-bold text-white mb-6">
                {isBreak ? '☕ Break Time' : '🍅 Focus Session'}
              </h2>
              
              {/* Timer Display */}
              <div className="relative mb-8">
                <div className="w-48 h-48 mx-auto">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-gray-700"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 45}`}
                      strokeDashoffset={`${2 * Math.PI * 45 * (1 - timeLeft / (isBreak ? 5 * 60 : 25 * 60))}`}
                      className={isBreak ? "text-green-500" : "text-blue-500"}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={isRunning ? pauseTimer : startTimer}
                  className={`p-4 rounded-full text-white transition-colors ${
                    isRunning 
                      ? 'bg-yellow-600 hover:bg-yellow-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>
                <button
                  onClick={resetTimer}
                  className="p-4 bg-gray-600 hover:bg-gray-700 rounded-full text-white transition-colors"
                >
                  <RotateCcw className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Stats and AI Insights */}
          <div className="space-y-6">
            {/* Today's Stats */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <h3 className="text-white text-lg font-bold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
                Today's Progress
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{completedPomodoros}</div>
                  <p className="text-gray-400 text-sm">Completed</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{completedPomodoros * 25}</div>
                  <p className="text-gray-400 text-sm">Minutes</p>
                </div>
              </div>
            </div>

            {/* AI Coach Tips */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <h3 className="text-white text-lg font-bold mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-purple-400" />
                AI Coach Tips
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-800 rounded-lg">
                  <p className="text-gray-300 text-sm">
                    💡 <strong>Tip:</strong> Take a 2-minute walk during your break to boost focus for the next session.
                  </p>
                </div>
                <div className="p-3 bg-gray-800 rounded-lg">
                  <p className="text-gray-300 text-sm">
                    🧠 <strong>Focus:</strong> Try the "single-tasking" approach - one task per Pomodoro session.
                  </p>
                </div>
                {completedPomodoros >= 2 && (
                  <div className="p-3 bg-green-900/20 border border-green-800 rounded-lg">
                    <p className="text-green-300 text-sm">
                      🎉 <strong>Great job!</strong> You're in the flow state. Consider a longer 15-minute break after this session.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Pomodoro Technique Info */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <h3 className="text-white text-lg font-bold mb-4">How it Works</h3>
              <div className="space-y-2 text-gray-300 text-sm">
                <p>🍅 <strong>25 minutes</strong> focused work</p>
                <p>☕ <strong>5 minutes</strong> short break</p>
                <p>🏖️ <strong>15-30 minutes</strong> long break (every 4 pomodoros)</p>
                <p>🎯 <strong>Single task</strong> per session</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}