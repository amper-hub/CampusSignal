import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Issue } from '../entities/issue.entity';
import { Suggestion } from '../entities/suggestion.entity';
import { Vote } from '../entities/vote.entity';

@Injectable()
export class IssuesService {
  constructor(
    @InjectRepository(Issue)
    private readonly issueRepo: Repository<Issue>,
    @InjectRepository(Vote)
    private readonly voteRepo: Repository<Vote>,
    @InjectRepository(Suggestion)
    private readonly suggestionRepo: Repository<Suggestion>,
  ) {}

  async list(): Promise<any[]> {
    const issues = await this.issueRepo.find({
      relations: ['user', 'user.role', 'votes', 'suggestions'],
      order: { createdAt: 'DESC' },
    });

    return issues.map(issue => {
      const agree = issue.votes?.filter(v => v.value === 1).length ?? 0;
      const disagree = issue.votes?.filter(v => v.value === -1).length ?? 0;
      return {
        ...issue,
        agree,
        disagree,
        suggestions: issue.suggestions?.map(s => ({
          id: s.id,
          description: s.description,
          imageUrl: s.imageUrl,
          user: { id: s.user?.id, email: s.user?.email },
          createdAt: s.createdAt,
        })) ?? [],
      };
    });
  }

  async get(id: string): Promise<any> {
    const issue = await this.issueRepo.findOne({
      where: { id: Number(id) },
      relations: ['user', 'user.role', 'votes', 'suggestions'],
    });
    if (!issue) return null;

    const agree = issue.votes?.filter(v => v.value === 1).length ?? 0;
    const disagree = issue.votes?.filter(v => v.value === -1).length ?? 0;

    return {
      ...issue,
      agree,
      disagree,
      suggestions: issue.suggestions?.map(s => ({
        id: s.id,
        description: s.description,
        imageUrl: s.imageUrl,
        user: { id: s.user?.id, email: s.user?.email },
        createdAt: s.createdAt,
      })) ?? [],
    };
  }

  async create(data: {
    title?: string;
    category?: string;
    building?: string;
    room?: string;
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

    const issue = this.issueRepo.create({
      title: data.title || data.category || 'Issue',
      category: data.category,
      building: data.building,
      room: data.room,
      description: data.description.trim(),
      imageUrl: data.imageUrl,
      userId: data.userId,
    });

    return this.issueRepo.save(issue);
  }

  async update(id: number, data: Partial<Issue>, userId: number) {
    const issue = await this.issueRepo.findOne({ where: { id }, relations: ['user', 'user.role'] });
    if (!issue) {
      throw new NotFoundException('Issue not found');
    }
    if (issue.userId !== userId && issue.user.role?.name !== 'admin') {
      throw new ForbiddenException('Can only update own issues or be admin');
    }
    Object.assign(issue, data);
    return this.issueRepo.save(issue);
  }

  async delete(
    id: number,
    currentUser: { id: number; role?: { name?: string } | string },
  ) {
    const issue = await this.issueRepo.findOne({ where: { id } });
    if (!issue) {
      throw new NotFoundException('Issue not found');
    }
    const roleName =
      typeof currentUser?.role === 'string'
        ? currentUser.role
        : currentUser?.role?.name;
    const isAdmin = roleName === 'admin';
    if (issue.userId !== currentUser?.id && !isAdmin) {
      throw new ForbiddenException('You cannot delete this post');
    }
    // Cascade delete votes and suggestions
    await this.voteRepo.delete({ issueId: id });
    await this.suggestionRepo.delete({ issueId: id });
    await this.issueRepo.remove(issue);
    return { message: 'Issue deleted successfully' };
  }
}
