'use client'

import { useEffect, useState } from 'react'
import { FileText } from 'lucide-react'
import ContentManager from './ContentManager'
import { contentService } from '../services/contentService'
import { useAuth } from '../providers/AuthProvider'
import { Note } from '../types'

export default function NotesManager() {
  const { user } = useAuth()
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNotes = async () => {
    if (!user?.id) return
    
    try {
      setLoading(true)
      const fetchedNotes = await contentService.getNotes(Number(user.id))
      setNotes(fetchedNotes)
    } catch (err) {
      setError('Failed to fetch notes')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [user?.id])

  const handleCreateNote = async (note: Omit<Note, 'id' | 'createdAt'>) => {
    try {
      const newNote = await contentService.createNote(note)
      setNotes(prev => [...prev, newNote])
    } catch (err) {
      setError('Failed to create note')
      console.error(err)
    }
  }

  const handleUpdateNote = async (id: number, note: Partial<Note>) => {
    try {
      const updatedNote = await contentService.updateNote(id, note)
      setNotes(prev => prev.map(n => n.id === id ? updatedNote : n))
    } catch (err) {
      setError('Failed to update note')
      console.error(err)
    }
  }

  const handleDeleteNote = async (id: number) => {
    try {
      await contentService.deleteNote(id)
      setNotes(prev => prev.filter(note => note.id !== id))
    } catch (err) {
      setError('Failed to delete note')
      console.error(err)
    }
  }

  if (loading) {
    return <div className="p-8">Loading notes...</div>
  }

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>
  }

  return (
    <ContentManager
      type="notes"
      title="Notes"
      icon={FileText}
      initialItems={notes}
      onCreate={handleCreateNote}
      onUpdate={handleUpdateNote}
      onDelete={handleDeleteNote}
      onRefresh={fetchNotes}
    />
  )
} 