import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import { Vote } from '../entities/vote.entity';
import { Issue } from '../entities/issue.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vote, Issue])],
  providers: [VotesService],
  controllers: [VotesController],
})
export class VotesModule {}
