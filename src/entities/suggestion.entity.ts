import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Issue } from './issue.entity';

@Entity()
export class Suggestion {
  @PrimaryGeneratedColumn()
  id: number;

  // A short title for general suggestions (optional when used as a comment)
  @Column({ nullable: true })
  title: string;

  // The comment / suggestion text
  @Column('text')
  description: string;

  @Index()
  @Column()
  userId: number;

  @ManyToOne(() => User, user => user.suggestions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Index()
  @Column({ nullable: true })
  issueId: number;

  @ManyToOne(() => Issue, issue => issue.suggestions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'issueId' })
  issue: Issue;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  imageUrl: string;
}
