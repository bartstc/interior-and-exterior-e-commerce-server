import { Collection } from '../../../types/collection.type';
import { Type } from '../../../types/type.type';

export interface Product {
  name: string;
  collection: Collection;
  type: Type;
  character: string;
  price: number;
  color: string;
  description: string;
  images: string[];
}
