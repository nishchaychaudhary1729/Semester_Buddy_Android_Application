import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// Ensure this route runs on the Node.js runtime so fs is available
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as unknown as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Save inside public/uploads so files are visible on disk and can be served statically
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}--${file.name}`;
    const filepath = path.join(uploadDir, filename);

    await fs.promises.writeFile(filepath, buffer);

    return NextResponse.json({
      file: {
        fieldname: 'image',
        originalname: file.name,
        encoding: '7bit',
        mimetype: (file as any).type || 'application/octet-stream',
        destination: uploadDir,
        filename,
        path: filepath,
        publicPath: `/uploads/${filename}`,
        size: buffer.length
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Upload failed' }, { status: 500 });
  }
}
