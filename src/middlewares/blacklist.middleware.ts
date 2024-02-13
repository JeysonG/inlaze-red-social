import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { BlacklistService } from 'src/auth/services/blacklist.service';

@Injectable()
export class BlacklistMiddleware implements NestMiddleware {
  constructor(private readonly blacklistService: BlacklistService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    if (authHeader && typeof authHeader === 'string') {
      const [bearer, token] = authHeader.split(' ');

      if (bearer === 'Bearer' && token) {
        const isBlacklisted = await this.blacklistService.exist(token);

        if (isBlacklisted) throw new UnauthorizedException('Access Denied');
      }
    }

    next();
  }
}
