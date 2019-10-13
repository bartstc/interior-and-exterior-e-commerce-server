// tslint:disable-next-line: no-implicit-dependencies
import request from 'supertest';
import * as typeorm from 'typeorm';

import { fakeUser, appUtils, hashedPassword } from '../../fixtures/db';
import { AuthController } from './auth.controller';

(typeorm as any).getRepository = jest.fn();

describe('AuthController', () => {
  const { id, username, email, password } = fakeUser;
  process.env.JWT_SECRET = 'jwt_secret';

  describe('POST /auth/signup', () => {
    it('should return 400 when email or username already teken', async () => {
      (typeorm as any).getRepository = jest.fn(() => ({
        createQueryBuilder: jest.fn(() => ({
          where: jest.fn().mockReturnThis(),
          getMany: jest.fn().mockReturnValueOnce([fakeUser])
        }))
      }));

      const { app, controller } = appUtils(AuthController);

      const res = await request(app)
        .post(`${controller.path}/signup`)
        .send({ username, email, password });

      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        status: 400,
        message: 'Email or username already taken'
      });
    });

    it('should return 400 when password is not secure', async () => {
      (typeorm as any).getRepository = jest.fn(() => ({
        createQueryBuilder: jest.fn(() => ({
          where: jest.fn().mockReturnThis(),
          getMany: jest.fn().mockReturnValueOnce([fakeUser])
        }))
      }));

      const { app, controller } = appUtils(AuthController);

      const res = await request(app)
        .post(`${controller.path}/signup`)
        .send({ username, email, password: 'notsecurepassword' });

      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        status: 400,
        message: 'Password too weak'
      });
    });

    it('should return 200', async () => {
      (typeorm as any).getRepository = jest.fn(() => ({
        createQueryBuilder: jest.fn(() => ({
          where: jest.fn().mockReturnThis(),
          getMany: jest.fn().mockReturnValueOnce([])
        })),
        create: () => fakeUser,
        save: () => Promise.resolve(fakeUser)
      }));

      const { app, controller } = appUtils(AuthController);

      const res = await request(app)
        .post(`${controller.path}/signup`)
        .send({ username, email, password });

      expect(res.status).toEqual(200);
      expect(res.body).toEqual(expect.objectContaining({ id, username }));
    });
  });

  describe('POST /auth/signin', () => {
    it('should return 401 when user was not found', async () => {
      (typeorm as any).getRepository = jest.fn(() => ({
        findOne: () => Promise.resolve(undefined)
      }));

      const { app, controller } = appUtils(AuthController);

      const res = await request(app)
        .post(`${controller.path}/signin`)
        .send({ email, password });

      expect(res.status).toEqual(401);
      expect(res.body).toEqual({
        status: 401,
        message: 'Wrong credentials provided'
      });
    });

    it('should return 401 when provided wrong password', async () => {
      (typeorm as any).getRepository = jest.fn(() => ({
        findOne: () =>
          Promise.resolve({ ...fakeUser, password: hashedPassword })
      }));

      const { app, controller } = appUtils(AuthController);

      const res = await request(app)
        .post(`${controller.path}/signin`)
        .send({ email, password: 'wrong password' });

      expect(res.status).toEqual(401);
      expect(res.body).toEqual({
        status: 401,
        message: 'Wrong credentials provided'
      });
    });

    it('should return 200', async () => {
      (typeorm as any).getRepository = jest.fn(() => ({
        findOne: () =>
          Promise.resolve({ ...fakeUser, password: hashedPassword })
      }));

      const { app, controller } = appUtils(AuthController);

      const res = await request(app)
        .post(`${controller.path}/signin`)
        .send({ email, password });

      expect(res.status).toEqual(200);
      expect(res.body).toEqual(expect.objectContaining({ id, username }));
    });
  });

  describe('DELETE /auth', () => {
    it('should return 401 when missing auth token', async () => {
      const { app, controller } = appUtils(AuthController);

      const res = await request(app)
        .delete(controller.path)
        .send();

      expect(res.status).toEqual(401);
      expect(res.body).toEqual({
        status: 401,
        message: 'Authentication token missing'
      });
    });

    describe('when valid token provided', () => {
      let token: string;

      beforeEach(async () => {
        (typeorm as any).getRepository = jest.fn(() => ({
          findOne: () =>
            Promise.resolve({ ...fakeUser, password: hashedPassword })
        }));

        const { app, controller } = appUtils(AuthController);

        const res = await request(app)
          .post(`${controller.path}/signin`)
          .send({ email, password });

        token = res.body.token;
      });

      it('should return 401 when user does not exist', async () => {
        (typeorm as any).getRepository = jest.fn(() => ({
          delete: () => Promise.resolve({ affected: 0 }),
          findOne: () => Promise.resolve(fakeUser)
        }));

        const { app, controller } = appUtils(AuthController);

        const res = await request(app)
          .delete(controller.path)
          .set('x-auth-token', token)
          .send();

        expect(res.status).toEqual(404);
        expect(res.body).toEqual({
          status: 404,
          message: `User with id ${id} not found`
        });
      });

      it('should return 200', async () => {
        (typeorm as any).getRepository = jest.fn(() => ({
          delete: () => Promise.resolve({ affected: 1 }),
          findOne: () => Promise.resolve(fakeUser)
        }));

        const { app, controller } = appUtils(AuthController);

        const res = await request(app)
          .delete(controller.path)
          .set('x-auth-token', token)
          .send();

        expect(res.status).toEqual(200);
        expect(res.body).toEqual({ success: true });
      });
    });
  });

  describe('GET /auth', () => {
    describe('when valid token provided', () => {
      let token: string;

      beforeEach(async () => {
        (typeorm as any).getRepository = jest.fn(() => ({
          findOne: () =>
            Promise.resolve({ ...fakeUser, password: hashedPassword })
        }));

        const { app, controller } = appUtils(AuthController);

        const res = await request(app)
          .post(`${controller.path}/signin`)
          .send({ email, password });

        token = res.body.token;
      });

      it('should return 200', async () => {
        const { app, controller } = appUtils(AuthController);

        const res = await request(app)
          .get(controller.path)
          .set('x-auth-token', token)
          .send();

        expect(res.status).toEqual(200);
        expect(res.body).toEqual({ id, username });
      });
    });
  });
});
