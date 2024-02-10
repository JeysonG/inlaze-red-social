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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
