import { Injectable, ForbiddenException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Issue } from '../entities/issue.entity';
import { Suggestion } from '../entities/suggestion.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Issue) private issueRepo: Repository<Issue>,
    @InjectRepository(Suggestion)
    private suggestionRepo: Repository<Suggestion>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  private verifyAdminRole(userRole: string): void {
    if (userRole !== 'admin') {
      throw new ForbiddenException('Only admins can perform this action');
    }
  }

  async getAllIssues(): Promise<Issue[]> {
    return this.issueRepo.find({
      relations: ['user', 'comments'],
      order: { createdAt: 'DESC' },
    });
  }

  async getAllSuggestions(): Promise<Suggestion[]> {
    return this.suggestionRepo.find({
      relations: ['user', 'comments'],
      order: { createdAt: 'DESC' },
    });
  }

  async provideFeedbackOnIssue(
    issueId: number,
    dto: { feedback: string; status?: string },
    userRole: string,
  ): Promise<Issue> {
    this.verifyAdminRole(userRole);

    if (!dto.feedback || dto.feedback.trim().length === 0) {
      throw new BadRequestException('Feedback cannot be empty');
    }

    if (dto.feedback.length > 5000) {
      throw new BadRequestException('Feedback must not exceed 5000 characters');
    }

    const issue = await this.issueRepo.findOne({ where: { id: issueId } });
    if (!issue) {
      throw new NotFoundException('Issue not found');
    }

    issue.adminFeedback = dto.feedback.trim();
    issue.hasAdminFeedback = true;
    if (dto.status) {
      issue.status = dto.status;
    }

    return this.issueRepo.save(issue);
  }

  async provideFeedbackOnSuggestion(
    suggestionId: number,
    dto: { feedback: string },
    userRole: string,
  ): Promise<Suggestion> {
    this.verifyAdminRole(userRole);

    if (!dto.feedback || dto.feedback.trim().length === 0) {
      throw new BadRequestException('Feedback cannot be empty');
    }

    if (dto.feedback.length > 5000) {
      throw new BadRequestException('Feedback must not exceed 5000 characters');
    }

    const suggestion = await this.suggestionRepo.findOne({
      where: { id: suggestionId },
    });
    if (!suggestion) {
      throw new NotFoundException('Suggestion not found');
    }

    suggestion.adminFeedback = dto.feedback.trim();
    suggestion.hasAdminFeedback = true;

    return this.suggestionRepo.save(suggestion);
  }

  async getReportSummary(
    userRole: string,
  ): Promise<{
    totalIssues: number;
    totalSuggestions: number;
    totalUsers: number;
    issuesWithFeedback: number;
    pendingIssues: number;
  }> {
    this.verifyAdminRole(userRole);

    const totalIssues = await this.issueRepo.count();
    const totalSuggestions = await this.suggestionRepo.count();
    const totalUsers = await this.userRepo.count();
    const issuesWithFeedback = await this.issueRepo.count({
      where: { hasAdminFeedback: true },
    });
    const pendingIssues = await this.issueRepo.count({
      where: { status: 'open' },
    });

    return {
      totalIssues,
      totalSuggestions,
      totalUsers,
      issuesWithFeedback,
      pendingIssues,
    };
  }

  async deleteIssue(issueId: number, userRole: string) {
    this.verifyAdminRole(userRole);
    const issue = await this.issueRepo.findOne({ where: { id: issueId } });
    if (!issue) {
      throw new NotFoundException('Issue not found');
    }
    await this.issueRepo.remove(issue);
    return { message: 'Issue deleted successfully' };
  }

  async deleteSuggestion(suggestionId: number, userRole: string) {
    this.verifyAdminRole(userRole);
    const suggestion = await this.suggestionRepo.findOne({
      where: { id: suggestionId },
    });
    if (!suggestion) {
      throw new NotFoundException('Suggestion not found');
    }
    await this.suggestionRepo.remove(suggestion);
    return { message: 'Suggestion deleted successfully' };
  }
}
