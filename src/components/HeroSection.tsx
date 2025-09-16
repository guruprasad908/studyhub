// src/components/HeroSection.tsx
'use client'

import React from 'react'

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16" />
      
      <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Master Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">
                  Professional Preparation
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-blue-100 leading-relaxed">
                Transform your study routine with AI-powered preparation tools, 
                progress tracking, and collaborative learning features.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
                Start Free Trial
              </button>
              <button className="px-8 py-4 border-2 border-blue-300 hover:border-blue-200 rounded-lg font-semibold text-lg transition-all duration-200 hover:bg-blue-800/50">
                Watch Demo
              </button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-blue-700/50">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-300">10K+</div>
                <div className="text-blue-200">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-300">95%</div>
                <div className="text-blue-200">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-300">50+</div>
                <div className="text-blue-200">Exam Types</div>
              </div>
            </div>
          </div>
          
          {/* Right Side - Visual */}
          <div className="relative">
            <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              {/* Mock Dashboard Preview */}
              <div className="space-y-4">
                <div className="h-4 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-20 bg-white/20 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold">24</div>
                      <div className="text-sm opacity-80">Study Hours</div>
                    </div>
                  </div>
                  <div className="h-20 bg-white/20 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold">8</div>
                      <div className="text-sm opacity-80">Mock Tests</div>
                    </div>
                  </div>
                </div>
                <div className="h-32 bg-white/20 rounded-lg flex items-center justify-center">
                  <div className="text-center opacity-80">
                    📊 Progress Analytics
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-2xl animate-bounce">
              🎯
            </div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
              ⚡
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}