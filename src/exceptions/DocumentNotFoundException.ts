import { HttpException } from './HttpException';

export class DocumentNotFoundException extends HttpException {
  constructor(id: number) {
    super(404, `Document with id ${id} not found`);
  }
}
