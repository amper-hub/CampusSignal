import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Query,
  Param,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get()
  async getComments(
    @Query('issueId') issueId?: number,
    @Query('suggestionId') suggestionId?: number,
  ) {
    if (issueId) {
      return this.commentsService.listByIssue(Number(issueId));
    }
    if (suggestionId) {
      return this.commentsService.listBySuggestion(Number(suggestionId));
    }
    return [];
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createComment(@Body() dto: any, @Request() req: any) {
    return this.commentsService.create({
      content: dto.content,
      issueId: dto.issueId ? Number(dto.issueId) : undefined,
      suggestionId: dto.suggestionId ? Number(dto.suggestionId) : undefined,
      userId: req.user.id,
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async deleteComment(@Param('id') id: number, @Request() req: any) {
    await this.commentsService.delete(Number(id), req.user.id);
  }
}
