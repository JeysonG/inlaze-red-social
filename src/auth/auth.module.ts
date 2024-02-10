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
import { ClientsModule, Transport } from '@nestjs/microservices';

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
    ClientsModule.registerAsync([
      {
        name: 'VERIFY_EMAIL_SERVICE',
        inject: [config.KEY],
        useFactory: (configService: ConfigType<typeof config>) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'verify-email',
              brokers: [configService.kafka.broker],
            },
            consumer: {
              groupId: 'verify-email-consumer',
            },
          },
        }),
      },
    ]),
    KafkaModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
