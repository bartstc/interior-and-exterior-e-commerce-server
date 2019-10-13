import { getRepository, DeleteResult } from 'typeorm';

import { Product } from './product.entity';
import { AddProductDTO } from './dto/add-product.dto';
import { ProductNotFoundException } from '../../exceptions/ProductNotFoundException';

export class ProductService {
  private productRepository = getRepository(Product);

  addProduct = async (addProductDTO: AddProductDTO): Promise<Product> => {
    const newProduct = this.productRepository.create({
      ...addProductDTO
    });

    return this.productRepository.save(newProduct);
  };

  deleteProduct = async (id: string): Promise<DeleteResult> => {
    const result = await this.productRepository.delete({ id });

    if (result.affected === 0) {
      throw new ProductNotFoundException(id);
    }

    return result;
  };

  getProduct = async (id: string): Promise<Product> => {
    const product = await this.productRepository.findOne({
      where: { id }
    });

    if (!product) {
      throw new ProductNotFoundException(id);
    }

    return product;
  };

  getProductsByType = async (type: string): Promise<Product[]> => {
    if (type === 'all') {
      return this.productRepository.find();
    }

    return this.productRepository.find({
      where: { type }
    });
  };

  getProductsByQuery = async (query: string): Promise<Product[]> => {
    return this.productRepository
      .createQueryBuilder('product')
      .where('product.name ilike :name', { name: `%${query}%` })
      .getMany();
  };
}
