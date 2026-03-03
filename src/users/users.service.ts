import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  // placeholder for user operations
  async findAll(): Promise<any[]> {
    return [];
  }

  async findOne(id: string): Promise<any> {
    return null;
  }
}
