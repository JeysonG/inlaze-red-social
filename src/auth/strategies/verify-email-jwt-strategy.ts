import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigType } from '@nestjs/config';

import config from 'src/config';
import { PayloadToken } from '../models/token.model';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class VerifyEmailJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-verify-email',
) {
  constructor(
    @Inject(config.KEY) configService: ConfigType<typeof config>,
    private userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('token'),
      ignoreExpiration: false,
      secretOrKey: configService.mail.jwtSecret,
    });
  }

  /* Return token data for use */
  async validate(payload: PayloadToken) {
    if (!payload.email || payload.email === '')
      throw new UnauthorizedException('Access Denied');

    const user = await this.userService.findByEmail(payload.email);

    if (!user) throw new UnauthorizedException('Not Allow');

    return payload;
  }
}
