import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  UnauthorizedException,
  CallHandler,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

export interface CustomRequest extends Request {
  token: string;
}

@Injectable()
export class JwtInterceptor implements NestInterceptor {
  constructor(private readonly jwtService: JwtService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<boolean> {
    const req: CustomRequest = context.switchToHttp().getRequest();
    const authorizationHeader = req.headers['authorization'];

    if (!authorizationHeader)
      throw new UnauthorizedException('Missing authorization header');

    const [, token] = authorizationHeader.split(' ');

    if (!token) throw new UnauthorizedException('Not Allow');

    req.token = token;

    return next.handle();
  }
}
