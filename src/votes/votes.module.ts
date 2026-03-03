import { Module } from '@nestjs/common';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';

@Module({
  imports: [],
  providers: [VotesService],
  controllers: [VotesController],
})
export class VotesModule {}
