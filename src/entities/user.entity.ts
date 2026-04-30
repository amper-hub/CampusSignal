import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Index,
  JoinColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { Issue } from './issue.entity';
import { Suggestion } from './suggestion.entity';
import { Vote } from './vote.entity';
import { Comment } from './comment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Index()
  @Column()
  roleId: number;

  @ManyToOne(() => Role, role => role.users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @OneToMany(() => Issue, issue => issue.user)
  issues: Issue[];

  @OneToMany(() => Suggestion, suggestion => suggestion.user)
  suggestions: Suggestion[];

  @OneToMany(() => Vote, vote => vote.user)
  votes: Vote[];

  @OneToMany(() => Comment, comment => comment.user)
  comments: Comment[];
}
