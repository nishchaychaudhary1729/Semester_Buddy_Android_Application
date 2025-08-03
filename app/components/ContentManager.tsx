'use client'

import { useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import { Note, Notebook, Assignment } from '../types'
import { contentService } from '../services/contentService'

type ContentItem = Note | Notebook | Assignment

interface ContentManagerProps {
  type: 'notes' | 'notebooks' | 'assignments' | 'lectures'
  title: string
  icon: React.ElementType
  initialItems: ContentItem[]
  onCreate?: (item: Omit<ContentItem, 'id' | 'createdAt'>) => Promise<void>
  onUpdate?: (id: number, item: Partial<ContentItem>) => Promise<void>
  onDelete?: (id: number) => Promise<void>
  onRefresh?: () => Promise<void>
}

export default function ContentManager({ 
  type, 
  title, 
  icon: Icon, 
  initialItems,
  onCreate,
  onUpdate,
  onDelete,
  onRefresh
}: ContentManagerProps) {
  const [items, setItems] = useState<ContentItem[]>(initialItems)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      // First upload the file to GridFS
      const uploadResult = await contentService.uploadFile(file);
      
      if (uploadResult.success) {
        // Create a new item with the uploaded file information
        const newItem = {
          title: file.name,
          type: type,
          fileId: uploadResult.fileId,
          fileName: file.name,
          fileSize: file.size,
          userId: "1" // This will be handled by the server
        } as Omit<ContentItem, 'id' | 'createdAt'>

        // Call the onCreate callback to save the item to the database
        if (onCreate) {
          await onCreate(newItem)
        }

        // Refresh the items list to show the new upload
        if (onRefresh) {
          await onRefresh()
        }
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleEdit = async (id: number, updatedData: Partial<ContentItem>) => {
    try {
      if (onUpdate) {
        await onUpdate(id, updatedData)
      }
    } catch (error) {
      console.error('Update failed:', error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      if (onDelete) {
        await onDelete(id)
      }
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  const getIconColor = () => {
    switch (type) {
      case 'notes':
        return 'text-blue-500 bg-blue-100'
      case 'notebooks':
        return 'text-purple-500 bg-purple-100'
      case 'assignments':
        return 'text-orange-500 bg-orange-100'
      default:
        return 'text-blue-500 bg-blue-100'
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        <div className="relative">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="h-5 w-5" />
                <span>Upload {title.slice(0, -1)}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-lg ${getIconColor()}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(item.id, { title: 'Updated Title' })}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-800">{item.title}</h3>
            {'description' in item && item.description && (
              <p className="mt-2 text-gray-600">{item.description}</p>
            )}
            <p className="mt-4 text-sm text-gray-500">
              Created: {new Date(item.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
} 