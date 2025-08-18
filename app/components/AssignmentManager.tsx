'use client'

import { useEffect, useState } from 'react'
import { Calendar } from 'lucide-react'
import ContentManager from './ContentManager'
import { contentService } from '../services/contentService'
import { useAuth } from '../providers/AuthProvider'

export default function AssignmentManager() {
  const { user } = useAuth()
  const [assignments, setAssignments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAssignments = async () => {
    try {
      setLoading(true)
      // Reuse notes/notebooks style once assignments API exists; placeholder empty list
      setAssignments([])
    } catch (err) {
      setError('Failed to fetch assignments')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAssignments()
  }, [user?.id])

  const handleCreateAssignment = async (assignment: any) => {
    try {
      // TODO: call create assignment API once implemented
      setAssignments(prev => [...prev, { ...assignment, id: Date.now(), createdAt: new Date().toISOString() }])
    } catch (err) {
      setError('Failed to create assignment')
      console.error(err)
    }
  }

  if (loading) return <div className="p-8">Loading assignments...</div>
  if (error) return <div className="p-8 text-red-500">{error}</div>

  return (
    <ContentManager
      type="assignments"
      title="My Assignments"
      icon={Calendar}
      initialItems={assignments as any}
      onCreate={handleCreateAssignment}
      onRefresh={fetchAssignments}
    />
  )
}