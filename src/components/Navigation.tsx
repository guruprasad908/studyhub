'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home,
  Target,
  Clock,
  Brain,
  MessageCircle,
  Timer,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  TrendingUp,
  BookOpen
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

interface NavigationProps {
  user: any;
}

export default function Navigation({ user }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  const navigationItems = [
    {
      href: '/',
      label: 'Dashboard',
      icon: Home,
      description: 'Overview & Progress'
    },
    {
      href: '/roadmap',
      label: 'Roadmap',
      icon: Target,
      description: 'Study Plans & Goals',
      badge: 'AI'
    },
    {
      href: '/today',
      label: 'Today Focus',
      icon: Clock,
      description: 'Daily Tasks & Pomodoro',
      badge: 'Smart'
    },
    {
      href: '/study-buddy',
      label: 'Study Buddy',
      icon: Brain,
      description: 'AI Learning Assistant',
      badge: 'AI'
    }
  ];

  const aiFeatures = [
    {
      href: '/chatbot',
      label: 'AI Chat',
      icon: MessageCircle,
      description: 'Quick Questions & Help'
    },
    {
      href: '/pomodoro-coach',
      label: 'Focus Coach',
      icon: Timer,
      description: 'Smart Break Timing'
    },
    {
      href: '/progress',
      label: 'Progress AI',
      icon: TrendingUp,
      description: 'Learning Analytics'
    }
  ];

  const NavItem = ({ item, isActive }: { item: any; isActive: boolean }) => (
    <Link
      href={item.href}
      className={`
        group flex items-center p-3 rounded-xl transition-all duration-200
        ${isActive 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
        }
      `}
      onClick={() => setIsMobileMenuOpen(false)}
    >
      <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="font-medium">{item.label}</span>
          {item.badge && (
            <span className={`
              px-2 py-0.5 text-xs font-semibold rounded-full
              ${isActive 
                ? 'bg-white/20 text-white' 
                : 'bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30'
              }
            `}>
              {item.badge}
            </span>
          )}
        </div>
        <p className={`text-xs mt-0.5 ${isActive ? 'text-blue-100' : 'text-gray-500 group-hover:text-gray-400'}`}>
          {item.description}
        </p>
      </div>
    </Link>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-900 text-white border border-gray-700"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-full w-80 bg-gray-900 border-r border-gray-800 z-40
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">StudyHub</h1>
                <p className="text-sm text-gray-400">AI-Powered Learning</p>
              </div>
            </div>
          </div>

          {/* User Profile */}
          {user && (
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-gray-400">Student</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <NavItem
                  key={item.href}
                  item={item}
                  isActive={pathname === item.href}
                />
              ))}
            </div>

            {/* AI Features Section */}
            <div className="pt-6">
              <div className="flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>AI Features</span>
              </div>
              <div className="space-y-1 mt-2">
                {aiFeatures.map((item) => (
                  <NavItem
                    key={item.href}
                    item={item}
                    isActive={pathname === item.href}
                  />
                ))}
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800">
            <div className="space-y-1">
              <Link
                href="/settings"
                className="flex items-center p-3 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Settings className="w-5 h-5 mr-3" />
                <span>Settings</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center p-3 rounded-xl text-gray-300 hover:bg-red-600/10 hover:text-red-400 transition-colors"
              >
                <LogOut className="w-5 h-5 mr-3" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}