import { User } from '../modules/auth/interfaces/user.interface';
import { App } from '../app';

export const hashedPassword =
  '$2a$10$YSJaa7cTaVVzMdI8Pig2mO.exCuM/E02nQHzlgwB9BsFs2OWTNlvK';
export const fakeUser: User = {
  id: '2e5a394f-9add-46a5-8c5d-6f1cafd2a8df',
  username: 'JohnDoe',
  email: 'johndoe@gmail.com',
  password: 'John123$'
};

export const appUtils = (Controller: any) => {
  const controller = new Controller();
  const app = new App([controller]);

  return { app: app.getServer(), controller };
};
