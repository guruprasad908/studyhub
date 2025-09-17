'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, Send, RefreshCw, Bot, User } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import StudyBuddyChatbot from '../../components/StudyBuddyChatbot';

export default function ChatbotPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">AI Chat</h1>
              <p className="text-gray-400">Quick questions and instant help</p>
            </div>
          </div>
        </div>

        {/* Main Chat Interface */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">AI Study Assistant</h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Get instant answers to your study questions. I'm here to help with explanations, 
              tips, and guidance on any topic.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
              <h3 className="text-white font-medium mb-2">Study Help</h3>
              <p className="text-gray-400 text-sm">Ask questions about any subject or concept</p>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
              <h3 className="text-white font-medium mb-2">Learning Tips</h3>
              <p className="text-gray-400 text-sm">Get personalized study strategies</p>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
              <h3 className="text-white font-medium mb-2">Motivation</h3>
              <p className="text-gray-400 text-sm">Stay motivated and focused</p>
            </div>
          </div>

          {/* Redirect notice */}
          <div className="text-center">
            <p className="text-gray-300 mb-4">
              Click the floating chat button in the bottom-right corner to start chatting, 
              or visit the full <a href="/study-buddy" className="text-blue-400 hover:text-blue-300">Study Buddy</a> page 
              for a comprehensive learning experience.
            </p>
          </div>
        </div>
      </div>

      {/* Include the floating chatbot */}
      <StudyBuddyChatbot />
    </div>
  );
}