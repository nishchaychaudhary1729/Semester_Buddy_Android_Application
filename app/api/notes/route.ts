import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { createNote, getNotesByUserId, getOrCreateUserByEmail } from '@/app/lib/dbService';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  try {
    // Get or create user in MongoDB
    const userObjectId = await getOrCreateUserByEmail(session.user.email);
    const userNotes = await getNotesByUserId(userObjectId);
    
    // Convert MongoDB documents to API response format
    const formattedNotes = userNotes.map(note => ({
      id: note._id?.toString(),
      userId: note.userId.toString(),
      title: note.title,
      content: note.content,
      type: note.type,
      filePath: note.filePath,
      fileName: note.fileName,
      fileSize: note.fileSize,
      createdAt: note.createdAt.toISOString(),
      updatedAt: note.updatedAt.toISOString()
    }));
    
    return NextResponse.json(formattedNotes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    
    // Get or create user in MongoDB
    const userObjectId = await getOrCreateUserByEmail(session.user.email);
    
    const noteData = {
      userId: userObjectId,
      title: body.title,
      content: body.content,
      type: body.type || 'text',
      // Normalize to public path if provided as absolute
      filePath: typeof body.filePath === 'string' ? body.filePath : undefined,
      fileName: body.fileName,
      fileSize: body.fileSize
    };
    
    const newNote = await createNote(noteData);
    
    // Convert to API response format
    const formattedNote = {
      id: newNote._id?.toString(),
      userId: newNote.userId.toString(),
      title: newNote.title,
      content: newNote.content,
      type: newNote.type,
      filePath: newNote.filePath,
      fileName: newNote.fileName,
      fileSize: newNote.fileSize,
      createdAt: newNote.createdAt.toISOString(),
      updatedAt: newNote.updatedAt.toISOString()
    };
    
    return NextResponse.json(formattedNote, { status: 201 });
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    );
  }
} 