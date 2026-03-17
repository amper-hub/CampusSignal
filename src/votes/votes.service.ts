import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from '../entities/vote.entity';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote)
    private readonly voteRepo: Repository<Vote>,
  ) {}

  async count(issueId: string): Promise<number> {
    return this.voteRepo.count({ where: { issueId: Number(issueId) } });
  }

  async vote(data: { issueId: number; userId: number; value: number }) {
    const existing = await this.voteRepo.findOne({
      where: { issueId: data.issueId, userId: data.userId },
    });

    if (existing) {
      existing.value = data.value;
      return this.voteRepo.save(existing);
    }

    const vote = this.voteRepo.create({
      issueId: data.issueId,
      userId: data.userId,
      value: data.value,
    });

    return this.voteRepo.save(vote);
  }
}
