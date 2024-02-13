import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from '../services/auth.service';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ApiKeyGuard } from '../guards/api-key.guard';
import { CreateUserDto } from 'src/users/dto/user.dto';
import { JwtVerifyEmailGuard } from '../guards/jwt-verify-email.guard';
import VerifyEmailDto from '../dto/verifyEmail.dto';
import { CustomRequest, JwtInterceptor } from '../interceptors/jwt.interceptor';

@UseGuards(ApiKeyGuard)
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() payload: CreateUserDto) {
    return this.authService.signUp(payload);
  }

  @UseGuards(JwtVerifyEmailGuard)
  @Post('verify-email')
  verifyEmail(@Body() payload: VerifyEmailDto) {
    return this.authService.verifyEmail(payload);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Req() req: Request) {
    const user = req.user as User;
    return this.authService.signIn(user);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(JwtInterceptor)
  @Get('logout')
  logout(@Req() req: CustomRequest) {
    return this.authService.logout(req.decodedToken);
  }
}
