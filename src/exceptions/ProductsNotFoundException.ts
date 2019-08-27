import { HttpException } from './HttpException';

export class ProductsNotFoundException extends HttpException {
  constructor() {
    super(404, `No products found`);
  }
}
