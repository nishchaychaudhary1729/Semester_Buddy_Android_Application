import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { createNotebook, getNotebooksByUserId, getOrCreateUserByEmail } from '@/app/lib/dbService';
import { ObjectId } from 'mongodb';

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
    const userNotebooks = await getNotebooksByUserId(userObjectId);
    
    // Convert MongoDB documents to API response format
    const formattedNotebooks = userNotebooks.map(notebook => ({
      id: notebook._id?.toString(),
      userId: notebook.userId.toString(),
      title: notebook.title,
      description: notebook.description,
      filePath: notebook.filePath,
      fileName: notebook.fileName,
      fileSize: notebook.fileSize,
      createdAt: notebook.createdAt.toISOString(),
      updatedAt: notebook.updatedAt.toISOString()
    }));
    
    return NextResponse.json(formattedNotebooks);
  } catch (error) {
    console.error('Error fetching notebooks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notebooks' },
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
    
    const notebookData = {
      userId: userObjectId,
      title: body.title,
      description: body.description,
      filePath: body.filePath,
      fileName: body.fileName,
      fileSize: body.fileSize
    };
    
    const newNotebook = await createNotebook(notebookData);
    
    // Convert to API response format
    const formattedNotebook = {
      id: newNotebook._id?.toString(),
      userId: newNotebook.userId.toString(),
      title: newNotebook.title,
      description: newNotebook.description,
      filePath: newNotebook.filePath,
      fileName: newNotebook.fileName,
      fileSize: newNotebook.fileSize,
      createdAt: newNotebook.createdAt.toISOString(),
      updatedAt: newNotebook.updatedAt.toISOString()
    };
    
    return NextResponse.json(formattedNotebook, { status: 201 });
  } catch (error) {
    console.error('Error creating notebook:', error);
    return NextResponse.json(
      { error: 'Failed to create notebook' },
      { status: 500 }
    );
  }
} 