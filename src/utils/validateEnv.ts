import { port, cleanEnv } from 'envalid';

export const validateEnv = () => {
  cleanEnv(process.env, {
    PORT: port()
  });
};

// https://www.npmjs.com/package/envalid
