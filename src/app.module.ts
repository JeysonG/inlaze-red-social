import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
    DatabaseModule,
    AuthModule,
    UsersModule,
    KafkaModule,
  ],
  controllers: [AppController],
  providers: [AppService, FakeMSConsumer],
})
export class AppModule {}
