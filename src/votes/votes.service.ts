import { Injectable } from '@nestjs/common';

@Injectable()
export class VotesService {
  // placeholder for vote operations
  async count(issueId: string): Promise<number> {
    return 0;
  }
}
