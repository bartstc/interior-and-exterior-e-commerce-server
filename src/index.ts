import 'dotenv/config';
import 'reflect-metadata';
import { createConnection } from 'typeorm';

import { config } from './ormconfig';
import { validateEnv } from './utils/validateEnv';
import { App } from './app';
import { User } from './modules/auth/user.entity';
import { AuthController } from './modules/auth/auth.controller';
import { ProductController } from './modules/product/product.controller';

// expand Request interface with a new property: user: User
declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

validateEnv();

(async (): Promise<void> => {
  try {
    const connection = await createConnection(config);
    connection.runMigrations();
    console.log(`Is connected: ${connection.isConnected}`);
  } catch (err) {
    console.log('Error while connecting to the database', err);
    return err;
  }

  const app = new App([new AuthController(), new ProductController()]);
  app.listen();
})();

// create test brunch for deployment
// git push heroku HEAD:master
// after deployment: add env variables
// heroku logs --tail -> debugging

/* Start conf
- npm init
- tsc --init // tsconfig.json
*/
