import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { getNotebookById, updateNotebook, deleteNotebook, getOrCreateUserByEmail } from '@/app/lib/dbService';
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
    const notebookId = params.id;
    const body = await request.json();
    
    // Get or create user in MongoDB
    const userObjectId = await getOrCreateUserByEmail(session.user.email);
    
    // Check if notebook exists and belongs to user
    const existingNotebook = await getNotebookById(notebookId);
    if (!existingNotebook || !existingNotebook.userId.equals(userObjectId)) {
      return NextResponse.json(
        { error: 'Notebook not found' },
        { status: 404 }
      );
    }
    
    // Update the notebook
    const updateData = {
      title: body.title,
      description: body.description,
      filePath: body.filePath,
      fileName: body.fileName,
      fileSize: body.fileSize
    };
    
    const success = await updateNotebook(notebookId, updateData);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update notebook' },
        { status: 500 }
      );
    }
    
    // Get updated notebook
    const updatedNotebook = await getNotebookById(notebookId);
    
    // Convert to API response format
    const formattedNotebook = {
      id: updatedNotebook?._id?.toString(),
      userId: updatedNotebook?.userId.toString(),
      title: updatedNotebook?.title,
      description: updatedNotebook?.description,
      filePath: updatedNotebook?.filePath,
      fileName: updatedNotebook?.fileName,
      fileSize: updatedNotebook?.fileSize,
      createdAt: updatedNotebook?.createdAt.toISOString(),
      updatedAt: updatedNotebook?.updatedAt.toISOString()
    };
    
    return NextResponse.json(formattedNotebook);
  } catch (error) {
    console.error('Error updating notebook:', error);
    return NextResponse.json(
      { error: 'Failed to update notebook' },
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
    const notebookId = params.id;
    
    // Get or create user in MongoDB
    const userObjectId = await getOrCreateUserByEmail(session.user.email);
    
    // Check if notebook exists and belongs to user
    const existingNotebook = await getNotebookById(notebookId);
    if (!existingNotebook || !existingNotebook.userId.equals(userObjectId)) {
      return NextResponse.json(
        { error: 'Notebook not found' },
        { status: 404 }
      );
    }
    
    // Delete associated file from disk, if present
    try {
      const storedPath = (existingNotebook as any).filePath as string | undefined;
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
      console.error('Failed to delete file for notebook:', fileErr);
    }

    const success = await deleteNotebook(notebookId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete notebook' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ message: 'Notebook deleted successfully' });
  } catch (error) {
    console.error('Error deleting notebook:', error);
    return NextResponse.json(
      { error: 'Failed to delete notebook' },
      { status: 500 }
    );
  }
} 