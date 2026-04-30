import { Controller, Get, Param, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { VotesService } from './votes.service';

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Get(':issueId')
  async count(@Param('issueId') issueId: string) {
    return this.votesService.count(issueId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async vote(@Body() body: any, @Request() req: any) {
    const userId = req.user?.id;
    return this.votesService.vote({
      issueId: Number(body.issueId),
      userId,
      value: Number(body.value) === -1 ? -1 : 1,
    });
  }
}
