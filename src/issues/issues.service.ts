import { Injectable } from '@nestjs/common';

@Injectable()
export class IssuesService {
  // placeholder for issue operations
  async list(): Promise<any[]> {
    return [];
  }

  async get(id: string): Promise<any> {
    return null;
  }
}
