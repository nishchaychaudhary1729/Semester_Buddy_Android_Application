import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { getNotebookById, updateNotebook, deleteNotebook, getOrCreateUserByEmail } from '@/app/lib/dbService';

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
      description: body.description
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