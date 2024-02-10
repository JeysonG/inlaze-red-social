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
  };
});
