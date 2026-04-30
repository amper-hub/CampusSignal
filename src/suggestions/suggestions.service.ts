import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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
    if (!data.userId) {
      throw new BadRequestException('Authenticated user is required');
    }
    if (!data.description || !data.description.trim()) {
      throw new BadRequestException('Description is required');
    }

    const suggestion = this.suggestionRepo.create({
      issueId: data.issueId,
      title: data.title,
      description: data.description.trim(),
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

  async delete(
    id: number,
    currentUser: {
      id: number;
      roleId?: number;
      role?: { name?: string } | string;
    },
  ) {
    const suggestion = await this.suggestionRepo.findOne({ where: { id } });
    if (!suggestion) {
      throw new NotFoundException('Suggestion not found');
    }
    const roleName =
      typeof currentUser?.role === 'string'
        ? currentUser.role
        : currentUser?.role?.name;
    const isAdmin = currentUser?.roleId === 1 || roleName === 'admin';
    if (suggestion.userId !== currentUser?.id && !isAdmin) {
      throw new ForbiddenException('You cannot delete this post');
    }
    await this.suggestionRepo.remove(suggestion);
    return { message: 'Suggestion deleted successfully' };
  }
}
