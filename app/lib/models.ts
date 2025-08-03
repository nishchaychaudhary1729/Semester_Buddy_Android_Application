import { ObjectId } from 'mongodb';

// MongoDB Document Interfaces
export interface UserDocument {
  _id?: ObjectId;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NoteDocument {
  _id?: ObjectId;
  userId: ObjectId;
  title: string;
  content?: string;
  type: string;
  // GridFS file ID instead of external URL
  fileId?: ObjectId;
  fileName?: string;
  fileSize?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotebookDocument {
  _id?: ObjectId;
  userId: ObjectId;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssignmentDocument {
  _id?: ObjectId;
  userId: ObjectId;
  title: string;
  description?: string;
  dueDate?: Date;
  status: 'pending' | 'in_progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

export interface LectureDocument {
  _id?: ObjectId;
  userId: ObjectId;
  title: string;
  description?: string;
  date?: Date;
  notes?: string;
  // GridFS file IDs for attachments
  attachments?: Array<{
    fileId: ObjectId;
    fileName: string;
    fileSize: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  NOTES: 'notes',
  NOTEBOOKS: 'notebooks',
  ASSIGNMENTS: 'assignments',
  LECTURES: 'lectures'
} as const; 