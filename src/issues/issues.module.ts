import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IssuesService } from './issues.service';
import { IssuesController } from './issues.controller';
import { Issue } from '../entities/issue.entity';
import { Vote } from '../entities/vote.entity';
import { Suggestion } from '../entities/suggestion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Issue, Vote, Suggestion])],
  providers: [IssuesService],
  controllers: [IssuesController],
})
export class IssuesModule {}
