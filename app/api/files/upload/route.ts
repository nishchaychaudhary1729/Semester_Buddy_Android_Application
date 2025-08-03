import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { gridFSService } from '@/app/lib/gridfs';
import { getOrCreateUserByEmail } from '@/app/lib/dbService';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const description = formData.get('description') as string;
    const tags = formData.get('tags') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Get or create user in MongoDB
    const userObjectId = await getOrCreateUserByEmail(session.user.email);

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Upload to GridFS
    const fileId = await gridFSService.uploadFile(
      buffer,
      file.name,
      file.type,
      userObjectId,
      {
        originalName: file.name,
        description: description || undefined,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : undefined
      }
    );

    return NextResponse.json({
      success: true,
      fileId: fileId.toString(),
      filename: file.name,
      size: file.size,
      contentType: file.type,
      message: 'File uploaded successfully'
    });

  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
} 