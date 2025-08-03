'use client'

import { BookOpen } from 'lucide-react'
import ContentManager from './ContentManager'

export default function LectureManager() {
  const initialLectures = [
    { id: 1, title: 'Introduction to Programming', createdAt: '2024-01-15' },
    { id: 2, title: 'Object-Oriented Programming', createdAt: '2024-01-16' },
    { id: 3, title: 'Database Systems', createdAt: '2024-01-17' },
  ]

  return (
    <ContentManager
      type="lectures"
      title="My Lectures"
      icon={BookOpen}
      initialItems={initialLectures as any}
    />
  )
} 