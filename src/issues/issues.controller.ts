import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UseGuards,
  Request,
  Patch,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { IssuesService } from './issues.service';
import { UploadsService } from '../uploads/uploads.service';

@Controller('issues')
export class IssuesController {
  constructor(
    private readonly issuesService: IssuesService,
    private readonly uploadsService: UploadsService,
  ) {}

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
    let imageUrl: string | undefined;
    if (pickedFile) {
      const uploaded = await this.uploadsService.upload(pickedFile);
      imageUrl = uploaded.url || undefined;
    }
    return this.issuesService.create({
      ...body,
      userId,
      imageUrl,
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
    return this.issuesService.delete(Number(id), req.user);
  }
}
