// tslint:disable-next-line: no-implicit-dependencies
import request from 'supertest';
import * as typeorm from 'typeorm';

import { ProductController } from './product.controller';
import { fakeProduct, appUtils, fakeProductId } from '../../fixtures/db';

(typeorm as any).getRepository = jest.fn();

describe('ProductController', () => {
  describe('POST /products', () => {
    it('should return 500', async () => {
      (typeorm as any).getRepository = jest.fn(() => ({
        create: () => fakeProduct,
        save: () => Promise.reject()
      }));

      const { app, controller } = appUtils(ProductController);

      const res = await request(app)
        .post(controller.path)
        .send(fakeProduct);

      expect(res.status).toEqual(500);
      expect(res.body).toEqual({
        status: 500,
        message: 'Error occurred while adding the product'
      });
    });

    it('should return 200', async () => {
      (typeorm as any).getRepository = jest.fn(() => ({
        create: () => fakeProduct,
        save: () => Promise.resolve(fakeProduct)
      }));

      const { app, controller } = appUtils(ProductController);

      const res = await request(app)
        .post(controller.path)
        .send(fakeProduct);

      expect(res.status).toEqual(200);
      expect(res.body).toEqual(fakeProduct);
    });
  });

  describe('DELETE /products/:id', () => {
    it('should return 404 when product not found', async () => {
      (typeorm as any).getRepository = jest.fn(() => ({
        delete: () => Promise.resolve({ affected: 0 })
      }));

      const { app, controller } = appUtils(ProductController);
      const notExistingProductId = 'aaa';

      const res = await request(app)
        .delete(`${controller.path}/${notExistingProductId}`)
        .send();

      expect(res.status).toEqual(404);
      expect(res.body).toEqual({
        status: 404,
        message: `Product with id ${notExistingProductId} not found`
      });
    });

    it('should return 200', async () => {
      (typeorm as any).getRepository = jest.fn(() => ({
        delete: () => Promise.resolve({ affected: 1 })
      }));

      const { app, controller } = appUtils(ProductController);

      const res = await request(app)
        .delete(`${controller.path}/${fakeProductId}`)
        .send();

      expect(res.status).toEqual(200);
      expect(res.body).toEqual({ success: true });
    });
  });

  describe('GET /products/:id', () => {
    it('should return 404 when product not found', async () => {
      (typeorm as any).getRepository = jest.fn(() => ({
        findOne: () => Promise.resolve(undefined)
      }));

      const { app, controller } = appUtils(ProductController);
      const notExistingProductId = 'aaa';

      const res = await request(app)
        .get(`${controller.path}/${notExistingProductId}`)
        .send();

      expect(res.status).toEqual(404);
      expect(res.body).toEqual({
        status: 404,
        message: `Product with id ${notExistingProductId} not found`
      });
    });

    it('should return 200', async () => {
      (typeorm as any).getRepository = jest.fn(() => ({
        findOne: () => Promise.resolve(fakeProduct)
      }));

      const { app, controller } = appUtils(ProductController);

      const res = await request(app)
        .get(`${controller.path}/${fakeProductId}`)
        .send();

      expect(res.status).toEqual(200);
      expect(res.body).toEqual(fakeProduct);
    });
  });

  describe('GET /products/type/:type', () => {
    it('should return 404', async () => {
      (typeorm as any).getRepository = jest.fn(() => ({
        find: () => Promise.reject()
      }));

      const { app, controller } = appUtils(ProductController);

      const res = await request(app)
        .get(`${controller.path}/type/benches`)
        .send();

      expect(res.status).toEqual(404);
      expect(res.body).toEqual({
        status: 404,
        message: 'No products found'
      });
    });

    it('should return 200', async () => {
      (typeorm as any).getRepository = jest.fn(() => ({
        find: () => Promise.resolve([fakeProduct])
      }));

      const { app, controller } = appUtils(ProductController);

      const res = await request(app)
        .get(`${controller.path}/type/benches`)
        .send();

      expect(res.status).toEqual(200);
      expect(res.body).toEqual([fakeProduct]);
    });
  });

  describe('GET /products/query/:query', () => {
    it('should return 404', async () => {
      (typeorm as any).getRepository = jest.fn(() => ({
        createQueryBuilder: jest.fn(() => ({
          where: jest.fn().mockReturnThis(),
          getMany: () => Promise.reject()
        }))
      }));

      const { app, controller } = appUtils(ProductController);

      const res = await request(app)
        .get(`${controller.path}/query/black`)
        .send();

      expect(res.status).toEqual(404);
      expect(res.body).toEqual({
        status: 404,
        message: 'No products found'
      });
    });

    it('should return 200', async () => {
      (typeorm as any).getRepository = jest.fn(() => ({
        createQueryBuilder: jest.fn(() => ({
          where: jest.fn().mockReturnThis(),
          getMany: () => Promise.resolve([fakeProduct])
        }))
      }));

      const { app, controller } = appUtils(ProductController);

      const res = await request(app)
        .get(`${controller.path}/query/benches`)
        .send();

      expect(res.status).toEqual(200);
      expect(res.body).toEqual([fakeProduct]);
    });
  });
});
