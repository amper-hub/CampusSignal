import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Index,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Issue } from './issue.entity';
import { Comment } from './comment.entity';

@Entity()
export class Suggestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: false })
  hasAdminFeedback: boolean;

  @Column({ nullable: true, length: 5000 })
  adminFeedback?: string;

  @Index()
  @Column()
  userId: number;

  @Index()
  @Column({ nullable: true })
  issueId?: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, user => user.suggestions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Issue, issue => issue.suggestions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'issueId' })
  issue?: Issue;

  @OneToMany(() => Comment, comment => comment.suggestion)
  comments: Comment[];
}
