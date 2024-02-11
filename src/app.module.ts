import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import * as Joi from 'joi';

/* ENV config */
import config from './config';
import { environments } from './environments';

/* Controllers */
import { AppController } from './app.controller';

/* Services */
import { AppService } from './app.service';

/* Modules */
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { KafkaModule } from './kafka/kafka.module';
import { FakeMSConsumer } from './fakeMS.consumer';
import { BullModule } from '@nestjs/bull';
import { VerifyEmailQueueConsumer } from './verifyEmailQueue.consumer';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { VERIFY_EMAIL_SERVICE } from './auth/constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: environments[process.env.NODE_ENV] || '.env',
      load: [config],
      isGlobal: true,
      validationSchema: Joi.object({
        API_KEY: Joi.string().required(),
        SERVER_PORT: Joi.string().required(),
        MONGO_INITDB_ROOT_USERNAME:
          process.env.NODE_ENV === 'prod' ? Joi.string().required() : '',
        MONGO_INITDB_ROOT_PASSWORD:
          process.env.NODE_ENV === 'prod' ? Joi.string().required() : '',
        MONGO_DB: Joi.string().required(),
        MONGO_HOST: Joi.string().required(),
        MONGO_CONNECTION: Joi.string().required(),
      }),
    }),
    BullModule.forRootAsync({
      inject: [config.KEY],
      useFactory: async (configService: ConfigType<typeof config>) => ({
        redis: {
          host: configService.redis.host,
          port: Number(configService.redis.port),
        },
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: VERIFY_EMAIL_SERVICE,
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
    DatabaseModule,
    AuthModule,
    UsersModule,
    KafkaModule,
  ],
  controllers: [AppController],
  providers: [AppService, FakeMSConsumer, VerifyEmailQueueConsumer],
})
export class AppModule {}
