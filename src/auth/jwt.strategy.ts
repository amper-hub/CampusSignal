import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || 'supersecret',
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findByIdWithRole(Number(payload.sub));
    if (!user) {
      return null;
    }
    return {
      id: user.id,
      email: user.email,
      roleId: user.roleId,
      role: {
        id: user.roleId,
        name: user.roleId === 1 ? 'admin' : 'user',
      },
    };
  }
}
