import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id: Number(id) } });
  }

  async findByIdWithRole(id: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['role'],
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email }, relations: ['role'] });
  }

  async create(data: Partial<User>): Promise<User> {
    // If no roleId specified, default to 'user' role (roleId = 2).
    // Ensure user role exists in database
    let roleId = data.roleId;
    
    if (!roleId) {
      roleId = 2;
      console.log('[USERS] No roleId provided, defaulting to user role (ID: 2)');
    }

    const user = this.usersRepository.create({
      ...data,
      roleId,
    });

    const saved = await this.usersRepository.save(user);
    
    // Reload user with role relation to ensure it's populated
    const fullUser = await this.usersRepository.findOne({
      where: { id: saved.id },
      relations: ['role'],
    });

    if (!fullUser) {
      throw new Error('Failed to create user');
    }

    console.log('[USERS] User created successfully:', {
      id: fullUser.id,
      email: fullUser.email,
      roleId: fullUser.roleId,
      role: fullUser.role?.name,
    });

    return fullUser;
  }

  async getProfile(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['role', 'issues', 'suggestions'],
      order: {
        issues: { createdAt: 'DESC' },
        suggestions: { createdAt: 'DESC' },
      },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      roleId: user.roleId,
      role: user.roleId === 1 ? 'admin' : 'user',
      issues: user.issues ?? [],
      suggestions: user.suggestions ?? [],
    };
  }
}
