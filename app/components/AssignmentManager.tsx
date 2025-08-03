'use client'

import { Calendar } from 'lucide-react'
import ContentManager from './ContentManager'

export default function AssignmentManager() {
  const initialAssignments = [
    { id: 1, title: 'Programming Assignment 1', createdAt: '2024-01-15' },
    { id: 2, title: 'Database Project', createdAt: '2024-01-16' },
    { id: 3, title: 'Web Development Task', createdAt: '2024-01-17' },
  ]

  return (
    <ContentManager
      type="assignments"
      title="My Assignments"
      icon={Calendar}
      initialItems={initialAssignments as any}
    />
  )
} 