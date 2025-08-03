import { GridFSBucket, ObjectId } from 'mongodb';
import { getDatabase } from './mongodb';

export interface FileMetadata {
  _id?: ObjectId;
  filename: string;
  contentType: string;
  size: number;
  userId: ObjectId;
  uploadDate: Date;
  metadata?: {
    originalName: string;
    description?: string;
    tags?: string[];
  };
}

export class GridFSService {
  private bucket!: GridFSBucket;

  // Initialize the bucket (must be called before using the service)
  async init() {
    const db = await getDatabase();
    this.bucket = new GridFSBucket(db);
  }

  // Upload a file to GridFS
  async uploadFile(
    buffer: Buffer,
    filename: string,
    contentType: string,
    userId: ObjectId,
    metadata?: {
      originalName?: string;
      description?: string;
      tags?: string[];
    }
  ): Promise<ObjectId> {
    const uploadStream = this.bucket.openUploadStream(filename, {
      contentType,
      metadata: {
        userId: userId.toString(),
        originalName: metadata?.originalName || filename,
        description: metadata?.description,
        tags: metadata?.tags || []
      }
    });

    return new Promise<ObjectId>((resolve, reject) => {
      uploadStream.on('error', (error: Error) => {
        reject(error);
      });
    
      uploadStream.on('finish', () => {
        resolve(uploadStream.id as ObjectId);
      });
    
      uploadStream.end(buffer);
    });
    
    
  }

  // Download a file from GridFS
  async downloadFile(fileId: ObjectId): Promise<{ buffer: Buffer; metadata: any }> {
    const fileMetadata = await this.getFileMetadata(fileId);
    if (!fileMetadata) throw new Error('File not found');

    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      const downloadStream = this.bucket.openDownloadStream(fileId);

      downloadStream.on('data', (chunk) => chunks.push(chunk));
      downloadStream.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve({ buffer, metadata: fileMetadata });
      });
      downloadStream.on('error', (err) => reject(err));
    });
  }

  // Get file metadata
  async getFileMetadata(fileId: ObjectId): Promise<any> {
    const filesCursor = this.bucket.find({ _id: fileId });
    const file = await filesCursor.next();
    return file;
  }

  // List files uploaded by a user
  async listUserFiles(userId: ObjectId): Promise<any[]> {
    const filesCursor = this.bucket.find({ 'metadata.userId': userId.toString() });
    return await filesCursor.toArray();
  }

  // Delete a file from GridFS
  async deleteFile(fileId: ObjectId): Promise<void> {
    await this.bucket.delete(fileId);
  }

  // Get readable stream of a file
  async getFileStream(fileId: ObjectId): Promise<NodeJS.ReadableStream> {
    return this.bucket.openDownloadStream(fileId);
  }
}

// Singleton export
export const gridFSService = new GridFSService();

// Somewhere during app startup, make sure to initialize:
await gridFSService.init(); // Ensure this is awaited before first use
