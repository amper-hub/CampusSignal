import { Controller, Get, Param } from '@nestjs/common';
import { VotesService } from './votes.service';

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Get(':issueId')
  async count(@Param('issueId') issueId: string) {
    return this.votesService.count(issueId);
  }
}
