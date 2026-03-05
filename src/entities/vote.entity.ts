import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Index,
  Unique,
  JoinColumn,
  Column,
} from 'typeorm';
import { User } from './user.entity';
import { Issue } from './issue.entity';

@Entity()
@Unique(['userId', 'issueId'])
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  userId: number;

  @ManyToOne(() => User, user => user.votes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Index()
  @Column()
  issueId: number;

  @ManyToOne(() => Issue, issue => issue.votes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'issueId' })
  issue: Issue;
}
