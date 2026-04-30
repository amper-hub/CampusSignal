import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Param,
  Patch,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
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
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'image', maxCount: 1 }, { name: 'file', maxCount: 1 }]),
  )
  async create(
    @UploadedFiles() files: { image?: any[]; file?: any[] },
    @Body() body: any,
    @Request() req: any,
  ) {
    const userId = req.user?.id;
    const pickedFile = files?.image?.[0] ?? files?.file?.[0];
    let imageUrl = '';
    if (pickedFile) {
      const uploadResult = await this.uploadsService.upload(pickedFile);
      imageUrl = uploadResult.url || '';
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
    return this.suggestionsService.delete(Number(id), req.user);
  }
}
