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
import { Vote } from './vote.entity';
import { Suggestion } from './suggestion.entity';
import { Comment } from './comment.entity';

@Entity()
export class Issue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  building: string;

  @Column({ nullable: true })
  room: string;

  @Column('text')
  description: string;

  @Column({ default: 'open' })
  status: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: false })
  hasAdminFeedback: boolean;

  @Column({ nullable: true, length: 5000 })
  adminFeedback?: string;

  @Index()
  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, user => user.issues, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Vote, vote => vote.issue)
  votes: Vote[];

  @OneToMany(() => Comment, comment => comment.issue)
  comments: Comment[];

  @OneToMany(() => Suggestion, suggestion => suggestion.issue)
  suggestions: Suggestion[];
}
