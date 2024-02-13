import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigType } from '@nestjs/config';

import config from 'src/config';
import { PayloadToken } from '../models/token.model';
import { UsersService } from 'src/users/services/users.service';
import { BlacklistService } from '../services/blacklist.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(config.KEY) configService: ConfigType<typeof config>,
    private readonly userService: UsersService,
    private readonly blacklistService: BlacklistService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwtSecret,
    });
  }

  /* Return token data for use */
  async validate(payload: PayloadToken) {
    const isBlackedList = await this.blacklistService.exist(payload.email);

    if (isBlackedList || !payload.email || payload.email === '')
      throw new UnauthorizedException('Access Denied');

    const user = await this.userService.findByEmail(payload.email);

    if (!user || !user.isEmailVerified)
      throw new UnauthorizedException('Not Allow');

    return payload;
  }
}
