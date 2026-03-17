import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Suggestion } from '../entities/suggestion.entity';

@Injectable()
export class SuggestionsService {
  constructor(
    @InjectRepository(Suggestion)
    private readonly suggestionRepo: Repository<Suggestion>,
  ) {}

  async listByIssue(issueId: number): Promise<Suggestion[]> {
    return this.suggestionRepo.find({
      where: { issueId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async listAll(): Promise<Suggestion[]> {
    return this.suggestionRepo.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(data: {
    issueId?: number;
    title?: string;
    description: string;
    imageUrl?: string;
    userId: number;
  }) {
    const suggestion = this.suggestionRepo.create({
      issueId: data.issueId,
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      userId: data.userId,
    });
    return this.suggestionRepo.save(suggestion);
  }

  async update(id: number, description: string, userId: number) {
    const suggestion = await this.suggestionRepo.findOne({ where: { id } });
    if (!suggestion) {
      throw new NotFoundException('Suggestion not found');
    }
    if (suggestion.userId !== userId) {
      throw new ForbiddenException('Can only update own suggestions');
    }
    suggestion.description = description;
    return this.suggestionRepo.save(suggestion);
  }

  async delete(id: number, userId: number) {
    const suggestion = await this.suggestionRepo.findOne({ where: { id } });
    if (!suggestion) {
      throw new NotFoundException('Suggestion not found');
    }
    if (suggestion.userId !== userId) {
      throw new ForbiddenException('Can only delete own suggestions');
    }
    await this.suggestionRepo.remove(suggestion);
    return { message: 'Suggestion deleted' };
  }
}
