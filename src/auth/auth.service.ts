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
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, role: user.role?.name },
    };
  }

  async register(body: RegisterDto) {
    const existing = await this.usersService.findByEmail(body.email);
    if (existing) {
      throw new UnauthorizedException('Email already registered');
    }

    const hashed = await bcrypt.hash(body.password, 10);
    const newUser = await this.usersService.create({
      email: body.email,
      password: hashed,
    });

    const payload = { sub: newUser.id, email: newUser.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: newUser.id, email: newUser.email, role: newUser.role?.name },
    };
  }
}
