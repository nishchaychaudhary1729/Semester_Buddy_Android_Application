import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { getNoteById, updateNote, deleteNote, getOrCreateUserByEmail } from '@/app/lib/dbService';
import fs from 'fs';
import path from 'path';

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
      filePath: body.filePath,
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
      filePath: updatedNote?.filePath,
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
    // Attempt to delete associated file from local storage, if any
    try {
      const storedPath = (existingNote as any).filePath as string | undefined;
      if (storedPath) {
        let absolutePath = storedPath;
        if (!path.isAbsolute(absolutePath)) {
          const trimmed = absolutePath.replace(/^[/\\]+/, '');
          const candidatePublic = path.join(process.cwd(), 'public', trimmed);
          const candidateRoot = path.join(process.cwd(), trimmed);
          if (fs.existsSync(candidatePublic)) {
            absolutePath = candidatePublic;
          } else if (fs.existsSync(candidateRoot)) {
            absolutePath = candidateRoot;
          } else {
            absolutePath = path.join(process.cwd(), 'public', 'uploads', trimmed);
          }
        }
        if (fs.existsSync(absolutePath)) {
          await fs.promises.unlink(absolutePath);
        }
      }
    } catch (fileErr) {
      // Non-fatal: log and continue with note deletion
      console.error('Failed to delete file for note:', fileErr);
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