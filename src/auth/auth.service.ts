import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      return null;
    }

    // Do not return password
    const { password, ...result } = user;
    return result;
  }

  async login(body: LoginDto) {
    const { email, password } = body;
    
    // Find user with role relation
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    const roleId = user.roleId;
    const roleString = roleId === 1 ? 'admin' : 'user';
    
    console.log('[AUTH] Login successful:', {
      userId: user.id,
      email: user.email,
      role: roleString,
      roleId: user.roleId,
    });

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        roleId,
        role: roleString,
      },
    };
  }

  async register(body: RegisterDto) {
    const existing = await this.usersService.findByEmail(body.email);
    if (existing) {
      throw new UnauthorizedException('Email already registered');
    }

    const hashed = await bcrypt.hash(body.password, 10);
    
    // Create user with default 'user' role
    const newUser = await this.usersService.create({
      email: body.email,
      password: hashed,
    });

    // Ensure role is loaded
    const fullUser = await this.usersService.findByEmail(newUser.email);
    if (!fullUser || !fullUser.role) {
      throw new Error('Failed to assign user role');
    }

    const payload = { sub: fullUser.id, email: fullUser.email };
    const roleId = fullUser.roleId;
    const roleString = roleId === 1 ? 'admin' : 'user';

    console.log('[AUTH] Registration successful:', {
      userId: fullUser.id,
      email: fullUser.email,
      role: roleString,
    });

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: fullUser.id,
        email: fullUser.email,
        roleId,
        role: roleString,
      },
    };
  }
}
