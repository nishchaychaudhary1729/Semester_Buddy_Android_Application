import { ObjectId } from 'mongodb';
import { getDatabase } from './mongodb';
import { 
  UserDocument, 
  NoteDocument, 
  NotebookDocument, 
  AssignmentDocument, 
  LectureDocument,
  COLLECTIONS 
} from './models';

// Helper function to safely convert string to ObjectId
function toObjectId(id: string): ObjectId {
  if (!ObjectId.isValid(id)) {
    throw new Error(`Invalid ObjectId: ${id}`);
  }
  return new ObjectId(id);
}

// User operations
export async function createUser(userData: Omit<UserDocument, '_id' | 'createdAt' | 'updatedAt'>): Promise<UserDocument> {
  const db = await getDatabase();
  const now = new Date();
  const user: UserDocument = {
    ...userData,
    createdAt: now,
    updatedAt: now
  };
  
  const result = await db.collection(COLLECTIONS.USERS).insertOne(user);
  return { ...user, _id: result.insertedId };
}

export async function getUserByEmail(email: string): Promise<UserDocument | null> {
  const db = await getDatabase();
  return await db.collection(COLLECTIONS.USERS).findOne({ email }) as UserDocument | null;
}

export async function getOrCreateUserByEmail(email: string): Promise<ObjectId> {
  const db = await getDatabase();
  
  // First try to find user by email
  let user = await db.collection(COLLECTIONS.USERS).findOne({ email }) as UserDocument | null;
  
  if (!user) {
    // Create new user if not found
    const now = new Date();
    const newUser: UserDocument = {
      email,
      createdAt: now,
      updatedAt: now
    };
    
    const result = await db.collection(COLLECTIONS.USERS).insertOne(newUser);
    return result.insertedId;
  }
  
  return user._id!;
}

// Note operations
export async function createNote(noteData: Omit<NoteDocument, '_id' | 'createdAt' | 'updatedAt'>): Promise<NoteDocument> {
  const db = await getDatabase();
  const now = new Date();
  const note: NoteDocument = {
    ...noteData,
    createdAt: now,
    updatedAt: now
  };
  
  const result = await db.collection(COLLECTIONS.NOTES).insertOne(note);
  return { ...note, _id: result.insertedId };
}

export async function getNotesByUserId(userId: ObjectId): Promise<NoteDocument[]> {
  try {
    const db = await getDatabase();
    return await db.collection(COLLECTIONS.NOTES)
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray() as NoteDocument[];
  } catch (error) {
    console.error('Error in getNotesByUserId:', error);
    return [];
  }
}

export async function getNoteById(noteId: string): Promise<NoteDocument | null> {
  try {
    const db = await getDatabase();
    const noteObjectId = toObjectId(noteId);
    return await db.collection(COLLECTIONS.NOTES).findOne({ _id: noteObjectId }) as NoteDocument | null;
  } catch (error) {
    console.error('Error in getNoteById:', error);
    return null;
  }
}

export async function updateNote(noteId: string, updateData: Partial<Omit<NoteDocument, '_id' | 'userId' | 'createdAt'>>): Promise<boolean> {
  try {
    const db = await getDatabase();
    const noteObjectId = toObjectId(noteId);
    const result = await db.collection(COLLECTIONS.NOTES).updateOne(
      { _id: noteObjectId },
      { 
        $set: { 
          ...updateData, 
          updatedAt: new Date() 
        } 
      }
    );
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Error in updateNote:', error);
    return false;
  }
}

export async function deleteNote(noteId: string): Promise<boolean> {
  try {
    const db = await getDatabase();
    const noteObjectId = toObjectId(noteId);
    const result = await db.collection(COLLECTIONS.NOTES).deleteOne({ _id: noteObjectId });
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error in deleteNote:', error);
    return false;
  }
}

// Notebook operations
export async function createNotebook(notebookData: Omit<NotebookDocument, '_id' | 'createdAt' | 'updatedAt'>): Promise<NotebookDocument> {
  const db = await getDatabase();
  const now = new Date();
  const notebook: NotebookDocument = {
    ...notebookData,
    createdAt: now,
    updatedAt: now
  };
  
  const result = await db.collection(COLLECTIONS.NOTEBOOKS).insertOne(notebook);
  return { ...notebook, _id: result.insertedId };
}

export async function getNotebooksByUserId(userId: ObjectId): Promise<NotebookDocument[]> {
  try {
    const db = await getDatabase();
    return await db.collection(COLLECTIONS.NOTEBOOKS)
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray() as NotebookDocument[];
  } catch (error) {
    console.error('Error in getNotebooksByUserId:', error);
    return [];
  }
}

export async function getNotebookById(notebookId: string): Promise<NotebookDocument | null> {
  try {
    const db = await getDatabase();
    const notebookObjectId = toObjectId(notebookId);
    return await db.collection(COLLECTIONS.NOTEBOOKS).findOne({ _id: notebookObjectId }) as NotebookDocument | null;
  } catch (error) {
    console.error('Error in getNotebookById:', error);
    return null;
  }
}

export async function updateNotebook(notebookId: string, updateData: Partial<Omit<NotebookDocument, '_id' | 'userId' | 'createdAt'>>): Promise<boolean> {
  try {
    const db = await getDatabase();
    const notebookObjectId = toObjectId(notebookId);
    const result = await db.collection(COLLECTIONS.NOTEBOOKS).updateOne(
      { _id: notebookObjectId },
      { 
        $set: { 
          ...updateData, 
          updatedAt: new Date() 
        } 
      }
    );
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Error in updateNotebook:', error);
    return false;
  }
}

export async function deleteNotebook(notebookId: string): Promise<boolean> {
  try {
    const db = await getDatabase();
    const notebookObjectId = toObjectId(notebookId);
    const result = await db.collection(COLLECTIONS.NOTEBOOKS).deleteOne({ _id: notebookObjectId });
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error in deleteNotebook:', error);
    return false;
  }
}

// Assignment operations
export async function createAssignment(assignmentData: Omit<AssignmentDocument, '_id' | 'createdAt' | 'updatedAt'>): Promise<AssignmentDocument> {
  const db = await getDatabase();
  const now = new Date();
  const assignment: AssignmentDocument = {
    ...assignmentData,
    createdAt: now,
    updatedAt: now
  };
  
  const result = await db.collection(COLLECTIONS.ASSIGNMENTS).insertOne(assignment);
  return { ...assignment, _id: result.insertedId };
}

export async function getAssignmentsByUserId(userId: ObjectId): Promise<AssignmentDocument[]> {
  try {
    const db = await getDatabase();
    return await db.collection(COLLECTIONS.ASSIGNMENTS)
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray() as AssignmentDocument[];
  } catch (error) {
    console.error('Error in getAssignmentsByUserId:', error);
    return [];
  }
}

export async function getAssignmentById(assignmentId: string): Promise<AssignmentDocument | null> {
  try {
    const db = await getDatabase();
    const assignmentObjectId = toObjectId(assignmentId);
    return await db.collection(COLLECTIONS.ASSIGNMENTS).findOne({ _id: assignmentObjectId }) as AssignmentDocument | null;
  } catch (error) {
    console.error('Error in getAssignmentById:', error);
    return null;
  }
}

export async function updateAssignment(assignmentId: string, updateData: Partial<Omit<AssignmentDocument, '_id' | 'userId' | 'createdAt'>>): Promise<boolean> {
  try {
    const db = await getDatabase();
    const assignmentObjectId = toObjectId(assignmentId);
    const result = await db.collection(COLLECTIONS.ASSIGNMENTS).updateOne(
      { _id: assignmentObjectId },
      { 
        $set: { 
          ...updateData, 
          updatedAt: new Date() 
        } 
      }
    );
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Error in updateAssignment:', error);
    return false;
  }
}

export async function deleteAssignment(assignmentId: string): Promise<boolean> {
  try {
    const db = await getDatabase();
    const assignmentObjectId = toObjectId(assignmentId);
    const result = await db.collection(COLLECTIONS.ASSIGNMENTS).deleteOne({ _id: assignmentObjectId });
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error in deleteAssignment:', error);
    return false;
  }
}

// Lecture operations
export async function createLecture(lectureData: Omit<LectureDocument, '_id' | 'createdAt' | 'updatedAt'>): Promise<LectureDocument> {
  const db = await getDatabase();
  const now = new Date();
  const lecture: LectureDocument = {
    ...lectureData,
    createdAt: now,
    updatedAt: now
  };
  
  const result = await db.collection(COLLECTIONS.LECTURES).insertOne(lecture);
  return { ...lecture, _id: result.insertedId };
}

export async function getLecturesByUserId(userId: ObjectId): Promise<LectureDocument[]> {
  try {
    const db = await getDatabase();
    return await db.collection(COLLECTIONS.LECTURES)
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray() as LectureDocument[];
  } catch (error) {
    console.error('Error in getLecturesByUserId:', error);
    return [];
  }
}

export async function getLectureById(lectureId: string): Promise<LectureDocument | null> {
  try {
    const db = await getDatabase();
    const lectureObjectId = toObjectId(lectureId);
    return await db.collection(COLLECTIONS.LECTURES).findOne({ _id: lectureObjectId }) as LectureDocument | null;
  } catch (error) {
    console.error('Error in getLectureById:', error);
    return null;
  }
}

export async function updateLecture(lectureId: string, updateData: Partial<Omit<LectureDocument, '_id' | 'userId' | 'createdAt'>>): Promise<boolean> {
  try {
    const db = await getDatabase();
    const lectureObjectId = toObjectId(lectureId);
    const result = await db.collection(COLLECTIONS.LECTURES).updateOne(
      { _id: lectureObjectId },
      { 
        $set: { 
          ...updateData, 
          updatedAt: new Date() 
        } 
      }
    );
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Error in updateLecture:', error);
    return false;
  }
}

export async function deleteLecture(lectureId: string): Promise<boolean> {
  try {
    const db = await getDatabase();
    const lectureObjectId = toObjectId(lectureId);
    const result = await db.collection(COLLECTIONS.LECTURES).deleteOne({ _id: lectureObjectId });
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error in deleteLecture:', error);
    return false;
  }
} 