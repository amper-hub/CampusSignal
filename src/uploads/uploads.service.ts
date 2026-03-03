import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadsService {
  // placeholder for file upload operations
  async upload(file: any): Promise<any> {
    return { url: '' };
  }
}
