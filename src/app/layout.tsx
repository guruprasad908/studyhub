// src/app/layout.tsx
import './globals.css'
import React from 'react'
import ErrorBoundary from '../components/ErrorBoundary'
import StudyBuddyChatbot from '../components/StudyBuddyChatbot'

export const metadata = {
  title: 'StudyHub - Your Free Study Companion',
  description: 'Beat procrastination and achieve your goals with our completely free study platform. Features Pomodoro timer, progress tracking, and anti-procrastination tools.',
  keywords: 'study planner, pomodoro timer, study goals, progress tracking, anti-procrastination, free study app, study companion',
  authors: [{ name: 'StudyHub Team' }],
  openGraph: {
    title: 'StudyHub - Your Free Study Companion',
    description: 'Transform your study routine with goal tracking, Pomodoro sessions, and anti-procrastination features. Completely free forever.',
    type: 'website',
    url: 'https://studyhub.com',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'StudyHub - Free Study Companion'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StudyHub - Your Free Study Companion',
    description: 'Beat procrastination and achieve your study goals with our completely free platform.',
    images: ['/og-image.jpg']
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body className="min-h-screen bg-[var(--bg)] text-[rgb(230,238,246)] antialiased">
        <ErrorBoundary>
          {children}
          <StudyBuddyChatbot />
        </ErrorBoundary>
      </body>
    </html>
  )
}
