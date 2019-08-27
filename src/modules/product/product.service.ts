import { getRepository } from 'typeorm';

import { Product } from './product.entity';
import { AddProductDTO } from './dto/add-product.dto';
import { ProductNotFoundException } from '../../exceptions/ProductNotFoundException';
import { ProductsNotFoundException } from '../../exceptions/ProductsNotFoundException';

export class ProductService {
  private productRepository = getRepository(Product);

  addProduct = async (addProductDTO: AddProductDTO): Promise<Product> => {
    const newProduct = this.productRepository.create({
      ...addProductDTO
    });

    await this.productRepository.save(newProduct);
    return newProduct;
  };

  deleteProduct = async (id: string): Promise<void> => {
    const result = await this.productRepository.delete({ id });

    if (result.affected === 0) throw new ProductNotFoundException(id);
  };

  getProduct = async (id: string): Promise<Product> => {
    try {
      const product = await this.productRepository.findOne({
        where: { id }
      });

      if (product) return product;
      else throw new ProductNotFoundException(id);
    } catch (err) {
      throw new ProductNotFoundException(id);
    }
  };

  getProductsByType = async (type: string): Promise<Product[]> => {
    try {
      return await this.productRepository.find({
        where: { type }
      });
    } catch (err) {
      throw new ProductsNotFoundException();
    }
  };

  getProductsByQuery = async (query: string): Promise<Product[]> => {
    try {
      return await this.productRepository
        .createQueryBuilder('product')
        .where('product.name ilike :name', { name: `%${query}%` })
        .getMany();
    } catch (err) {
      throw new ProductsNotFoundException();
    }
  };
}
