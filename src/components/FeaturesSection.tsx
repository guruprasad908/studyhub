// src/components/FeaturesSection.tsx
'use client'

import React from 'react'

export default function FeaturesSection() {
  const features = [
    {
      icon: '🎯',
      title: 'Smart Study Plans',
      description: 'AI-powered study schedules tailored to your exam date and learning pace.'
    },
    {
      icon: '⏱️',
      title: 'Pomodoro Timer',
      description: 'Built-in focus timer with session tracking and productivity analytics.'
    },
    {
      icon: '📊',
      title: 'Progress Analytics',
      description: 'Detailed insights into your study patterns, strengths, and areas for improvement.'
    },
    {
      icon: '📚',
      title: 'Resource Library',
      description: 'Curated study materials, practice questions, and expert-created content.'
    },
    {
      icon: '👥',
      title: 'Study Groups',
      description: 'Connect with peers, join study groups, and learn collaboratively.'
    },
    {
      icon: '🏆',
      title: 'Achievement System',
      description: 'Gamified learning with badges, streaks, and milestone celebrations.'
    }
  ]

  return (
    <section id="features" className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need to
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
              Succeed in Your Preparation
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            From personalized study plans to collaborative learning, we provide all the tools 
            you need for effective exam preparation.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Transform Your Preparation?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join thousands of successful candidates who have achieved their goals with our platform.
            </p>
            <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}