import { ConnectionOptions } from 'typeorm';
import { User } from './modules/auth/user.entity';

const developmentConfig: ConnectionOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [User],
  migrations: ['src/migration/**/*.ts'],
  synchronize: true,
  logging: true
};

const productionConfig: ConnectionOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL, // heroku db addons
  entities: [User],
  synchronize: true // should be false in production
};

export const config =
  process.env.NODE_ENV === 'production' ? productionConfig : developmentConfig;
