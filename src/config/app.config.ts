import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  nodeEnv: process.env.NODE_ENV,
  database: {
    name: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true' ? true : false,
    autoLoadEntities:
      process.env.DATABASE_AUTO_LOAD_ENTITY === 'true' ? true : false,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
  },
}));
