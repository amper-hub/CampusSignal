import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  private getRoleName(user: any): string {
    return user?.roleId === 1 ? 'admin' : (user?.role?.name || 'user');
  }

  @Get('issues')
  async getIssues(@Request() req: any) {
    return this.adminService.getAllIssues();
  }

  @Get('suggestions')
  async getSuggestions(@Request() req: any) {
    return this.adminService.getAllSuggestions();
  }

  @Patch('issues/:id/feedback')
  async provideFeedbackOnIssue(
    @Param('id') issueId: number,
    @Body() dto: { feedback: string; status?: string },
    @Request() req: any,
  ) {
    const userRole = this.getRoleName(req.user);
    return this.adminService.provideFeedbackOnIssue(
      Number(issueId),
      dto,
      userRole,
    );
  }

  @Patch('suggestions/:id/feedback')
  async provideFeedbackOnSuggestion(
    @Param('id') suggestionId: number,
    @Body() dto: { feedback: string },
    @Request() req: any,
  ) {
    const userRole = this.getRoleName(req.user);
    return this.adminService.provideFeedbackOnSuggestion(
      Number(suggestionId),
      dto,
      userRole,
    );
  }

  @Get('reports/summary')
  async getReportSummary(@Request() req: any) {
    const userRole = this.getRoleName(req.user);
    return this.adminService.getReportSummary(userRole);
  }

  @Delete('issues/:id')
  async deleteIssue(@Param('id') issueId: string, @Request() req: any) {
    const userRole = this.getRoleName(req.user);
    return this.adminService.deleteIssue(Number(issueId), userRole);
  }

  @Delete('suggestions/:id')
  async deleteSuggestion(
    @Param('id') suggestionId: string,
    @Request() req: any,
  ) {
    const userRole = this.getRoleName(req.user);
    return this.adminService.deleteSuggestion(Number(suggestionId), userRole);
  }
}
