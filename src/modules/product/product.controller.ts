import express, { Request, Response, NextFunction } from 'express';

import { Controller } from '../../types/controller.interface';
import { ProductService } from './product.service';
import { AddProductDTO } from './dto/add-product.dto';
import { ProductNotFoundException } from '../../exceptions/ProductNotFoundException';
import { ProductsNotFoundException } from '../../exceptions/ProductsNotFoundException';
import { validationMiddleware } from '../../middlewares/validation.middleware';

export class ProductController implements Controller {
  public path = '/products';
  public router = express.Router();
  private productService = new ProductService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router
      .post(this.path, validationMiddleware(AddProductDTO), this.addProduct)
      .delete(`${this.path}/:id`, this.deleteProduct)
      .get(`${this.path}/:id`, this.getProduct)
      .get(`${this.path}/type/:type`, this.getProductsByType)
      .get(`${this.path}/query/:query`, this.getProductsByQuery);
  }

  private addProduct = async (req: Request, res: Response): Promise<void> => {
    const productData: AddProductDTO = req.body;

    try {
    } catch (err) {}
    const newProduct = await this.productService.addProduct(productData);

    res.status(200).json(newProduct);
  };

  private deleteProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { id } = req.params;

    try {
      await this.productService.deleteProduct(id);
      res.status(200).json({ success: true });
    } catch (err) {
      next(new ProductNotFoundException(id));
    }
  };

  private getProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { id } = req.params;
    const product = await this.productService.getProduct(id);

    if (product) res.status(200).json(product);
    else next(new ProductNotFoundException(id));
  };

  private getProductsByType = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { type } = req.params;
    const products = await this.productService.getProductsByType(type);

    if (products) res.status(200).json(products);
    else next(new ProductsNotFoundException());
  };

  private getProductsByQuery = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { query } = req.params;
    const products = await this.productService.getProductsByQuery(query);

    if (products) res.status(200).json(products);
    else next(new ProductsNotFoundException());
  };
}
