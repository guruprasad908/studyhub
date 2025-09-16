// src/components/TestimonialsSection.tsx
'use client'

import React from 'react'

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'PMP Certified',
      company: 'Tech Lead at Microsoft',
      image: '👩‍💼',
      quote: 'PrepHub helped me pass my PMP certification on the first try. The study plans and progress tracking kept me motivated throughout my 3-month preparation.'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'CPA Candidate',
      company: 'Senior Accountant',
      image: '👨‍💼',
      quote: 'The collaborative features are amazing! I joined a study group and we all passed our CPA exam together. The mock tests were incredibly helpful.'
    },
    {
      name: 'Emily Thompson',
      role: 'Data Scientist',
      company: 'ML Engineer at Google',
      image: '👩‍🔬',
      quote: 'Used PrepHub for my machine learning certification. The Pomodoro timer and analytics helped me stay focused and track my weak areas effectively.'
    }
  ]

  return (
    <section className="py-24 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Trusted by
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
              Successful Professionals
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our users say about their success stories.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-gray-50 dark:bg-gray-700 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {/* Quote */}
              <div className="mb-6">
                <div className="text-4xl text-blue-500 mb-4">"</div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
                  {testimonial.quote}
                </p>
              </div>

              {/* Profile */}
              <div className="flex items-center">
                <div className="text-4xl mr-4">
                  {testimonial.image}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </h4>
                  <p className="text-blue-600 dark:text-blue-400 font-medium">
                    {testimonial.role}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Success Stats */}
        <div className="mt-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">95%</div>
              <div className="text-green-100">Pass Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">10,000+</div>
              <div className="text-green-100">Success Stories</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">50+</div>
              <div className="text-green-100">Certifications</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">4.9★</div>
              <div className="text-green-100">User Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}