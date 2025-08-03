import { Note, Notebook } from '../types'

const API_URL = '/api'

export const contentService = {
  // File upload operations
  async uploadFile(file: File, description?: string, tags?: string): Promise<{
    success: boolean;
    fileId: string;
    filename: string;
    size: number;
    contentType: string;
    message: string;
  }> {
    const formData = new FormData();
    formData.append('file', file);
    if (description) formData.append('description', description);
    if (tags) formData.append('tags', tags);

    const response = await fetch(`${API_URL}/files/upload`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) throw new Error('Failed to upload file');
    return response.json();
  },

  // Notes operations
  async getNotes(userId: number): Promise<Note[]> {
    const response = await fetch(`${API_URL}/notes`)
    if (!response.ok) throw new Error('Failed to fetch notes')
    return response.json()
  },

  async createNote(note: Omit<Note, 'id' | 'createdAt'>): Promise<Note> {
    const response = await fetch(`${API_URL}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note)
    })
    if (!response.ok) throw new Error('Failed to create note')
    return response.json()
  },

  async updateNote(id: number, note: Partial<Note>): Promise<Note> {
    const response = await fetch(`${API_URL}/notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note)
    })
    if (!response.ok) throw new Error('Failed to update note')
    return response.json()
  },

  async deleteNote(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/notes/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete note')
  },

  // Notebooks operations
  async getNotebooks(userId: number): Promise<Notebook[]> {
    const response = await fetch(`${API_URL}/notebooks`)
    if (!response.ok) throw new Error('Failed to fetch notebooks')
    return response.json()
  },

  async createNotebook(notebook: Omit<Notebook, 'id' | 'createdAt'>): Promise<Notebook> {
    const response = await fetch(`${API_URL}/notebooks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notebook)
    })
    if (!response.ok) throw new Error('Failed to create notebook')
    return response.json()
  },

  async updateNotebook(id: number, notebook: Partial<Notebook>): Promise<Notebook> {
    const response = await fetch(`${API_URL}/notebooks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notebook)
    })
    if (!response.ok) throw new Error('Failed to update notebook')
    return response.json()
  },

  async deleteNotebook(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/notebooks/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete notebook')
  }
} 