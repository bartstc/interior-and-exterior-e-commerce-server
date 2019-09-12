import { ConnectionOptions } from 'typeorm';
import { User } from './modules/auth/user.entity';
import { Product } from './modules/product/product.entity';

const developmentConfig: ConnectionOptions = {
  type: 'postgres',
  url: process.env.POSTGRES_DB_URL,
  entities: [User, Product],
  migrations: ['src/migration/**/*.ts'],
  synchronize: true,
  logging: true
};

const productionConfig: ConnectionOptions = {
  type: 'postgres',
  url: process.env.POSTGRES_DB_URL,
  entities: [User, Product],
  synchronize: false
};

export const config =
  process.env.NODE_ENV === 'production' ? productionConfig : developmentConfig;
