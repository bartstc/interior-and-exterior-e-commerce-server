import * as typeorm from 'typeorm';

import { ProductService } from './product.service';
import { fakeProduct, fakeProductId } from '../../fixtures/db';
import { ProductNotFoundException } from '../../exceptions/ProductNotFoundException';

(typeorm as any).getRepository = jest.fn();

describe('ProductService', () => {
  describe('when adding product', () => {
    it('should not throw an error', async () => {
      (typeorm as any).getRepository = jest.fn(() => ({
        create: () => fakeProduct,
        save: () => Promise.resolve(fakeProduct)
      }));

      const productService = new ProductService();
      await expect(productService.addProduct(fakeProduct)).resolves.toEqual(
        fakeProduct
      );
    });
  });

  describe('when deleting product', () => {
    it('should throw an error when product with provided id does not exist', async () => {
      (typeorm as any).getRepository = jest.fn(() => ({
        delete: () => Promise.resolve({ affected: 0 })
      }));

      const productService = new ProductService();
      await expect(
        productService.deleteProduct(fakeProductId)
      ).rejects.toMatchObject(new ProductNotFoundException(fakeProductId));
    });

    it('should not throw an error', async () => {
      (typeorm as any).getRepository = jest.fn(() => ({
        delete: () => Promise.resolve({ affected: 1 })
      }));

      const productService = new ProductService();
      await expect(
        productService.deleteProduct(fakeProductId)
      ).resolves.toEqual({ affected: 1 });
    });
  });

  describe('when fetching product', () => {
    it('should throw an error when product with provided id does not exist', async () => {
      (typeorm as any).getRepository = jest.fn(() => ({
        findOne: () => Promise.resolve(undefined)
      }));

      const productService = new ProductService();
      await expect(
        productService.getProduct(fakeProductId)
      ).rejects.toMatchObject(new ProductNotFoundException(fakeProductId));
    });

    it('should not throw an error', async () => {
      (typeorm as any).getRepository = jest.fn(() => ({
        findOne: () => Promise.resolve(fakeProduct)
      }));

      const productService = new ProductService();
      await expect(productService.getProduct(fakeProductId)).resolves.toEqual(
        fakeProduct
      );
    });
  });

  describe('when fetching products by type', () => {
    it('should not throw an error', async () => {
      (typeorm as any).getRepository = jest.fn(() => ({
        find: () => Promise.resolve([fakeProduct])
      }));

      const productService = new ProductService();
      await expect(productService.getProductsByType('all')).resolves.toEqual([
        fakeProduct
      ]);
    });

    it('should not throw an error', async () => {
      (typeorm as any).getRepository = jest.fn(() => ({
        find: () => Promise.resolve([fakeProduct])
      }));

      const productService = new ProductService();
      await expect(
        productService.getProductsByType('benches')
      ).resolves.toEqual([fakeProduct]);
    });
  });

  describe('when fetching products by query', () => {
    it('should not throw an error', async () => {
      (typeorm as any).getRepository = jest.fn(() => ({
        createQueryBuilder: jest.fn(() => ({
          where: jest.fn().mockReturnThis(),
          getMany: () => Promise.resolve([fakeProduct])
        }))
      }));

      const productService = new ProductService();
      await expect(productService.getProductsByQuery('black')).resolves.toEqual(
        [fakeProduct]
      );
    });
  });
});
