// import { NextRequest, NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '../../auth/[...nextauth]/route';
// import { gridFSService } from '@/app/lib/gridfs';
// import { getOrCreateUserByEmail } from '@/app/lib/dbService';
// import { ObjectId } from 'mongodb';

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const session = await getServerSession(authOptions);
  
//   if (!session?.user?.email) {
//     return NextResponse.json(
//       { error: 'Authentication required' },
//       { status: 401 }
//     );
//   }

//   try {
//     const fileId = new ObjectId(params.id);
    
//     // Get or create user in MongoDB
//     const userObjectId = await getOrCreateUserByEmail(session.user.email);
    
//     // Get file metadata to check ownership
//     const metadata = await gridFSService.getFileMetadata(fileId);
    
//     if (!metadata) {
//       return NextResponse.json(
//         { error: 'File not found' },
//         { status: 404 }
//       );
//     }

//     // Check if user owns the file
//     if (metadata.metadata?.userId !== userObjectId.toString()) {
//       return NextResponse.json(
//         { error: 'Access denied' },
//         { status: 403 }
//       );
//     }
    
//     // Get file stream
//     const stream = await gridFSService.getFileStream(fileId);
    
//     // Return file with proper headers
//     return new NextResponse(stream, {
//       headers: {
//         'Content-Type': metadata.contentType || 'application/octet-stream',
//         'Content-Disposition': `attachment; filename="${metadata.filename}"`,
//         'Content-Length': metadata.length.toString()
//       }
//     });

//   } catch (error) {
//     console.error('File download error:', error);
//     return NextResponse.json(
//       { error: 'Failed to download file' },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const session = await getServerSession(authOptions);
  
//   if (!session?.user?.email) {
//     return NextResponse.json(
//       { error: 'Authentication required' },
//       { status: 401 }
//     );
//   }

//   try {
//     const fileId = new ObjectId(params.id);
    
//     // Get or create user in MongoDB
//     const userObjectId = await getOrCreateUserByEmail(session.user.email);
    
//     // Get file metadata to check ownership
//     const metadata = await gridFSService.getFileMetadata(fileId);
    
//     if (!metadata) {
//       return NextResponse.json(
//         { error: 'File not found' },
//         { status: 404 }
//       );
//     }

//     // Check if user owns the file
//     if (metadata.metadata?.userId !== userObjectId.toString()) {
//       return NextResponse.json(
//         { error: 'Access denied' },
//         { status: 403 }
//       );
//     }
    
//     // Delete file
//     await gridFSService.deleteFile(fileId);
    
//     return NextResponse.json({
//       success: true,
//       message: 'File deleted successfully'
//     });

//   } catch (error) {
//     console.error('File deletion error:', error);
//     return NextResponse.json(
//       { error: 'Failed to delete file' },
//       { status: 500 }
//     );
//   }
// } 