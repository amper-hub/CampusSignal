import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Issue } from './issue.entity';
import { Suggestion } from './suggestion.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @Index()
  @Column({ nullable: true })
  issueId?: number;

  @Index()
  @Column({ nullable: true })
  suggestionId?: number;

  @Index()
  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Issue, issue => issue.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'issueId' })
  issue?: Issue;

  @ManyToOne(() => Suggestion, suggestion => suggestion.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'suggestionId' })
  suggestion?: Suggestion;

  @ManyToOne(() => User, user => user.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
