import { Note, Notebook } from '../types'

const API_URL = '/api'

export const contentService = {
  // File upload operations
  async uploadFile(
    file: File,
    description?: string,
    tags?: string
  ): Promise<{
    file: {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      destination: string;
      filename: string;
      path: string; // local absolute path
      publicPath?: string; // public path under /public for serving
      size: number;
    };
  }> {
    const formData = new FormData();
    // next-connect + multer route expects field name 'image'
    formData.append('image', file);
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
  ,
  // Lectures operations
  async getLectures(): Promise<any[]> {
    const response = await fetch(`${API_URL}/lecturenotes`)
    if (!response.ok) throw new Error('Failed to fetch lectures')
    return response.json()
  },
  async createLecture(lecture: any): Promise<any> {
    const response = await fetch(`${API_URL}/lecturenotes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lecture)
    })
    if (!response.ok) throw new Error('Failed to create lecture')
    return response.json()
  }
} 