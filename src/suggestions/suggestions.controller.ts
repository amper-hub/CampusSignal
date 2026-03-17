import { Controller, Get, Post, Body, Query, UseGuards, Request, Param, Patch, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { SuggestionsService } from './suggestions.service';
import { UploadsService } from '../uploads/uploads.service';

@Controller('suggestions')
export class SuggestionsController {
  constructor(
    private readonly suggestionsService: SuggestionsService,
    private readonly uploadsService: UploadsService,
  ) {}

  @Get()
  async listAll() {
    return this.suggestionsService.listAll();
  }

  @Get('issue/:id')
  async listByIssue(@Param('id') issueId: string) {
    return this.suggestionsService.listByIssue(Number(issueId));
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() body: any,
    @Request() req: any,
    @UploadedFile() file: any,
  ) {
    const userId = req.user?.id;
    let imageUrl = '';
    if (file) {
      const uploadResult = await this.uploadsService.upload(file);
      imageUrl = uploadResult.url;
    }
    return this.suggestionsService.create({
      issueId: body.issueId ? Number(body.issueId) : undefined,
      title: body.title,
      description: body.description,
      imageUrl,
      userId,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { description: string },
    @Request() req: any,
  ) {
    const userId = req.user?.id;
    return this.suggestionsService.update(Number(id), body.description, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.id;
    return this.suggestionsService.delete(Number(id), userId);
  }
}
