import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { getNoteById, updateNote, deleteNote, getOrCreateUserByEmail } from '@/app/lib/dbService';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  try {
    const noteId = params.id;
    const body = await request.json();
    
    // Get or create user in MongoDB
    const userObjectId = await getOrCreateUserByEmail(session.user.email);
    
    // Check if note exists and belongs to user
    const existingNote = await getNoteById(noteId);
    if (!existingNote || !existingNote.userId.equals(userObjectId)) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }
    
    // Update the note
    const updateData = {
      title: body.title,
      content: body.content,
      type: body.type,
      fileId: body.fileId,
      fileName: body.fileName,
      fileSize: body.fileSize
    };
    
    const success = await updateNote(noteId, updateData);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update note' },
        { status: 500 }
      );
    }
    
    // Get updated note
    const updatedNote = await getNoteById(noteId);
    
    // Convert to API response format
    const formattedNote = {
      id: updatedNote?._id?.toString(),
      userId: updatedNote?.userId.toString(),
      title: updatedNote?.title,
      content: updatedNote?.content,
      type: updatedNote?.type,
      fileId: updatedNote?.fileId?.toString(),
      fileName: updatedNote?.fileName,
      fileSize: updatedNote?.fileSize,
      createdAt: updatedNote?.createdAt.toISOString(),
      updatedAt: updatedNote?.updatedAt.toISOString()
    };
    
    return NextResponse.json(formattedNote);
  } catch (error) {
    console.error('Error updating note:', error);
    return NextResponse.json(
      { error: 'Failed to update note' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  try {
    const noteId = params.id;
    
    // Get or create user in MongoDB
    const userObjectId = await getOrCreateUserByEmail(session.user.email);
    
    // Check if note exists and belongs to user
    const existingNote = await getNoteById(noteId);
    if (!existingNote || !existingNote.userId.equals(userObjectId)) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }
    
    const success = await deleteNote(noteId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete note' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json(
      { error: 'Failed to delete note' },
      { status: 500 }
    );
  }
} 