import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { Issue } from '../entities/issue.entity';
import { Suggestion } from '../entities/suggestion.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    @InjectRepository(Issue) private issueRepo: Repository<Issue>,
    @InjectRepository(Suggestion)
    private suggestionRepo: Repository<Suggestion>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async listByIssue(issueId: number): Promise<Comment[]> {
    return this.commentRepo.find({
      where: { issueId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async listBySuggestion(suggestionId: number): Promise<Comment[]> {
    return this.commentRepo.find({
      where: { suggestionId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(dto: {
    content: string;
    issueId?: number;
    suggestionId?: number;
    userId: number;
  }): Promise<Comment> {
    if (!dto.content || dto.content.trim().length === 0) {
      throw new BadRequestException('Content cannot be empty');
    }

    if (dto.content.length > 5000) {
      throw new BadRequestException('Content must not exceed 5000 characters');
    }

    if (!dto.issueId && !dto.suggestionId) {
      throw new BadRequestException('Either issueId or suggestionId is required');
    }

    if (dto.issueId) {
      const issue = await this.issueRepo.findOne({ where: { id: dto.issueId } });
      if (!issue) {
        throw new NotFoundException('Issue not found');
      }
    }

    if (dto.suggestionId) {
      const suggestion = await this.suggestionRepo.findOne({
        where: { id: dto.suggestionId },
      });
      if (!suggestion) {
        throw new NotFoundException('Suggestion not found');
      }
    }

    const comment = this.commentRepo.create({
      content: dto.content.trim(),
      issueId: dto.issueId,
      suggestionId: dto.suggestionId,
      userId: dto.userId,
    });

    return this.commentRepo.save(comment);
  }

  async delete(commentId: number, userId: number): Promise<void> {
    const comment = await this.commentRepo.findOne({ where: { id: commentId } });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId !== userId) {
      throw new BadRequestException('You can only delete your own comments');
    }

    await this.commentRepo.remove(comment);
  }

  async countByIssue(issueId: number): Promise<number> {
    return this.commentRepo.count({ where: { issueId } });
  }

  async countBySuggestion(suggestionId: number): Promise<number> {
    return this.commentRepo.count({ where: { suggestionId } });
  }
}
