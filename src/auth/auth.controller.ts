import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body(ValidationPipe) body: LoginDto) {
    return this.authService.login(body);
  }

  @Post('register')
  async register(@Body(ValidationPipe) body: RegisterDto) {
    return this.authService.register(body);
  }
}
