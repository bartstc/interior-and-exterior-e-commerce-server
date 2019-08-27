import express, { Request, Response, NextFunction } from 'express';

import { Controller } from '../../types/controller.interface';
import { ProductService } from './product.service';
import { AddProductDTO } from './dto/add-product.dto';
import { validationMiddleware } from '../../middlewares/validation.middleware';
import { HttpException } from '../../exceptions/HttpException';

export class ProductController implements Controller {
  public path = '/products';
  public router = express.Router();
  private productService = new ProductService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes = (): void => {
    this.router
      .post(this.path, validationMiddleware(AddProductDTO), this.addProduct)
      .delete(`${this.path}/:id`, this.deleteProduct)
      .get(`${this.path}/:id`, this.getProduct)
      .get(`${this.path}/type/:type`, this.getProductsByType)
      .get(`${this.path}/query/:query`, this.getProductsByQuery);
  };

  private addProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const productData: AddProductDTO = req.body;

    try {
      const newProduct = await this.productService.addProduct(productData);
      res.status(200).json(newProduct);
    } catch (err) {
      next(new HttpException(500, 'Error occurred while adding the product'));
    }
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
      next(err);
    }
  };

  private getProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { id } = req.params;

    try {
      const product = await this.productService.getProduct(id);
      res.status(200).json(product);
    } catch (err) {
      next(err);
    }
  };

  private getProductsByType = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { type } = req.params;

    try {
      const products = await this.productService.getProductsByType(type);
      res.status(200).json(products);
    } catch (err) {
      next(err);
    }
  };

  private getProductsByQuery = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { query } = req.params;

    try {
      const products = await this.productService.getProductsByQuery(query);
      res.status(200).json(products);
    } catch (err) {
      next(err);
    }
  };
}
