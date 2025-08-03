'use client'

import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import ContentManager from './ContentManager'
import { contentService } from '../services/contentService'
import { useAuth } from '../providers/AuthProvider'
import { Notebook } from '../types'

export default function NotebookManager() {
  const { user } = useAuth()
  const [notebooks, setNotebooks] = useState<Notebook[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNotebooks = async () => {
    if (!user?.id) return
    
    try {
      setLoading(true)
      const fetchedNotebooks = await contentService.getNotebooks(Number(user.id))
      setNotebooks(fetchedNotebooks)
    } catch (err) {
      setError('Failed to fetch notebooks')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotebooks()
  }, [user?.id])

  const handleCreateNotebook = async (notebook: Omit<Notebook, 'id' | 'createdAt'>) => {
    try {
      const newNotebook = await contentService.createNotebook(notebook)
      setNotebooks(prev => [...prev, newNotebook])
    } catch (err) {
      setError('Failed to create notebook')
      console.error(err)
    }
  }

  const handleUpdateNotebook = async (id: number, notebook: Partial<Notebook>) => {
    try {
      const updatedNotebook = await contentService.updateNotebook(id, notebook)
      setNotebooks(prev => prev.map(n => n.id === id ? updatedNotebook : n))
    } catch (err) {
      setError('Failed to update notebook')
      console.error(err)
    }
  }

  const handleDeleteNotebook = async (id: number) => {
    try {
      await contentService.deleteNotebook(id)
      setNotebooks(prev => prev.filter(notebook => notebook.id !== id))
    } catch (err) {
      setError('Failed to delete notebook')
      console.error(err)
    }
  }

  if (loading) {
    return <div className="p-8">Loading notebooks...</div>
  }

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>
  }

  return (
    <ContentManager
      type="notebooks"
      title="Notebooks"
      icon={Sparkles}
      initialItems={notebooks}
      onCreate={handleCreateNotebook}
      onUpdate={handleUpdateNotebook}
      onDelete={handleDeleteNotebook}
      onRefresh={fetchNotebooks}
    />
  )
} 