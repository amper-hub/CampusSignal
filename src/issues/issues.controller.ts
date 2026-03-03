import { Controller, Get, Param } from '@nestjs/common';
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
}
