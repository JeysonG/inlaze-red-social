import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';

import { AuthService } from './services/auth.service';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './controllers/auth.controller';
import config from 'src/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { KafkaModule } from 'src/kafka/kafka.module';
import { BullModule } from '@nestjs/bull';
import { VERIFY_EMAIL_QUEUE } from './constants';
import { VerifyEmailJwtStrategy } from './strategies/verify-email-jwt-strategy';
import { BlacklistService } from './services/blacklist.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    /* Register Auth JWT with secret from env var */
    JwtModule.registerAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        return {
          secret: configService.jwtSecret,
          signOptions: {
            expiresIn: '30m',
          },
        };
      },
    }),
    BullModule.registerQueue({
      name: VERIFY_EMAIL_QUEUE,
    }),
    KafkaModule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    VerifyEmailJwtStrategy,
    BlacklistService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
