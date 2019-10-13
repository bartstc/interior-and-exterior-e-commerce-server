import { App } from '../app';
import { User } from '../modules/auth/interfaces/user.interface';
import { Product } from '../modules/product/interfaces/Product.interface';

export const hashedPassword =
  '$2a$10$YSJaa7cTaVVzMdI8Pig2mO.exCuM/E02nQHzlgwB9BsFs2OWTNlvK';
export const fakeUser: User = {
  id: '2e5a394f-9add-46a5-8c5d-6f1cafd2a8df',
  username: 'JohnDoe',
  email: 'johndoe@gmail.com',
  password: 'John123$'
};

export const fakeProductId = 'd89e04af-038d-43dc-b5f3-ef4797362e5a';
export const fakeProduct: Product = {
  name: 'Modern simple bench',
  collection: 'exterior',
  type: 'benches',
  character: 'modern',
  price: 175.99,
  color: 'brown',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
  images: [
    'https://i.ibb.co/k9vd54q/Modern-simple-bench.png',
    'https://i.ibb.co/k9vd54q/Modern-simple-bench.png',
    'https://i.ibb.co/k9vd54q/Modern-simple-bench.png'
  ]
};

export const appUtils = (Controller: any) => {
  const controller = new Controller();
  const app = new App([controller]);

  return { app: app.getServer(), controller };
};
