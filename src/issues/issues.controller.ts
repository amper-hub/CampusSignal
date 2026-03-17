import { Controller, Get, Param, Post, Body, UseGuards, Request, Patch, Delete, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IssuesService } from './issues.service';

@Controller('issues')
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Get()
  async list() {
    return this.issuesService.list();
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.issuesService.get(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() body: any, @Request() req: any) {
    const userId = req.user?.id;
    return this.issuesService.create({
      ...body,
      userId,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    const userId = req.user?.id;
    return this.issuesService.update(Number(id), body, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.id;
    return this.issuesService.delete(Number(id), userId);
  }
}
