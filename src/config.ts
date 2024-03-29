import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    serverPort: process.env.SERVER_PORT,
    mongo: {
      dbName: process.env.MONGO_DB,
      user: process.env.MONGO_INITDB_ROOT_USERNAME,
      password: process.env.MONGO_INITDB_ROOT_PASSWORD,
      host: process.env.MONGO_HOST,
      connection: process.env.MONGO_CONNECTION,
    },
    apiKey: process.env.API_KEY,
    jwtSecret: process.env.JWT_SECRET,
    kafka: {
      broker: process.env.KAFKA_BROKER,
    },
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      db: process.env.REDIS_DB,
      password: process.env.REDIS_PASSWORD,
      prefix: process.env.REDIS_PREFIX,
    },
    mail: {
      jwtSecret: process.env.JWT_VERIFICATION_SECRET,
      from: process.env.MAIL_FROM,
      url: process.env.EMAIL_CONFIRMATION_URL,
    },
  };
});
