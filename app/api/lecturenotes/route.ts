import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { createLecture, getLecturesByUserId, getOrCreateUserByEmail } from '@/app/lib/dbService';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
  try {
    const userObjectId = await getOrCreateUserByEmail(session.user.email);
    const lectures = await getLecturesByUserId(userObjectId);
    const formatted = lectures.map(l => ({
      id: l._id?.toString(),
      userId: l.userId.toString(),
      title: l.title,
      description: l.description,
      date: l.date ? l.date.toISOString() : undefined,
      notes: l.notes,
      attachments: (l.attachments || []).map(a => ({
        filePath: a.filePath,
        fileName: a.fileName,
        fileSize: a.fileSize
      })),
      createdAt: l.createdAt.toISOString(),
      updatedAt: l.updatedAt.toISOString()
    }));
    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching lectures:', error);
    return NextResponse.json({ error: 'Failed to fetch lectures' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const userObjectId = await getOrCreateUserByEmail(session.user.email);
    const lectureData = {
      userId: userObjectId,
      title: body.title,
      description: body.description,
      date: body.date ? new Date(body.date) : undefined,
      notes: body.notes,
      attachments: Array.isArray(body.attachments) ? body.attachments : []
    };
    const newLecture = await createLecture(lectureData);
    const formatted = {
      id: newLecture._id?.toString(),
      userId: newLecture.userId.toString(),
      title: newLecture.title,
      description: newLecture.description,
      date: newLecture.date ? newLecture.date.toISOString() : undefined,
      notes: newLecture.notes,
      attachments: (newLecture.attachments || []).map(a => ({
        filePath: a.filePath,
        fileName: a.fileName,
        fileSize: a.fileSize
      })),
      createdAt: newLecture.createdAt.toISOString(),
      updatedAt: newLecture.updatedAt.toISOString()
    };
    return NextResponse.json(formatted, { status: 201 });
  } catch (error) {
    console.error('Error creating lecture:', error);
    return NextResponse.json({ error: 'Failed to create lecture' }, { status: 500 });
  }
}

