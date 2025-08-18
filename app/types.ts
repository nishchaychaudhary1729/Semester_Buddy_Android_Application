export interface User {
  id: string
  email: string
  displayName?: string
  photoURL?: string
}

export interface Note {
  id: number
  userId: string
  title: string
  content?: string
  type: string
  filePath?: string
  fileName?: string
  fileSize?: number
  createdAt: string
}

export interface Notebook {
  id: number
  userId: string
  title: string
  description?: string
  filePath?: string
  fileName?: string
  fileSize?: number
  createdAt: string
}

export interface Assignment {
  id: number
  userId: string
  title: string
  description?: string
  dueDate?: string
  status: 'pending' | 'in_progress' | 'completed'
  filePath?: string
  fileName?: string
  fileSize?: number
  createdAt: string
} 