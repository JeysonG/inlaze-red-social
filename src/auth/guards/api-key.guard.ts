import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ConfigType } from '@nestjs/config';

import config from 'src/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    /* Validate Auth header */
    const request = context.switchToHttp().getRequest<Request>();
    const authApiKeyHeader = request.header('auth-api-key');
    const isAuth = authApiKeyHeader === this.configService.apiKey;

    if (!isAuth) throw new UnauthorizedException('Not allow');

    return isAuth;
  }
}
