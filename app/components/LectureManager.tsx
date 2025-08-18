'use client'

import { useEffect, useState } from 'react'
import { BookOpen } from 'lucide-react'
import ContentManager from './ContentManager'
import { contentService } from '../services/contentService'
import { useAuth } from '../providers/AuthProvider'

export default function LectureManager() {
  const { user } = useAuth()
  const [lectures, setLectures] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLectures = async () => {
    try {
      setLoading(true)
      const fetched = await contentService.getLectures()
      setLectures(fetched)
    } catch (err) {
      setError('Failed to fetch lectures')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLectures()
  }, [user?.id])

  const handleCreateLecture = async (lecture: any) => {
    try {
      const newLecture = await contentService.createLecture(lecture)
      setLectures(prev => [...prev, newLecture])
    } catch (err) {
      setError('Failed to create lecture')
      console.error(err)
    }
  }

  if (loading) return <div className="p-8">Loading lectures...</div>
  if (error) return <div className="p-8 text-red-500">{error}</div>

  return (
    <ContentManager
      type="lectures"
      title="My Lectures"
      icon={BookOpen}
      initialItems={lectures as any}
      onCreate={handleCreateLecture}
      onRefresh={fetchLectures}
    />
  )
}