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

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email }, relations: ['role'] });
  }

  async create(data: Partial<User>): Promise<User> {
    const user = this.usersRepository.create({
      ...data,
      roleId: data.roleId || 1, // Default to user role
    });
    const saved = await this.usersRepository.save(user);
    const fullUser = await this.usersRepository.findOne({ where: { id: saved.id }, relations: ['role'] });
    if (!fullUser) {
      throw new Error('Failed to create user');
    }
    return fullUser;
  }
}
