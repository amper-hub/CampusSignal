import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

@Injectable()
export class UploadsService {
  async upload(file: any): Promise<any> {
    if (!file || !file.buffer) {
      return { url: '' };
    }

    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true });
    }

    const ext = file.originalname?.split('.').pop() || 'bin';
    const fileName = `${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`;
    const filePath = join(uploadsDir, fileName);

    writeFileSync(filePath, file.buffer);

    return {
      url: `/uploads/${fileName}`,
    };
  }
}
