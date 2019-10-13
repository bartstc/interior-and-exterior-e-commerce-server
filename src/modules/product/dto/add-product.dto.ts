import { IsString, IsNotEmpty, IsNumber, IsArray } from 'class-validator';

import { Collection } from '../../../types/collection.type';
import { Type } from '../../../types/type.type';

export class AddProductDTO {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  collection!: Collection;

  @IsString()
  @IsNotEmpty()
  type!: Type;

  @IsString()
  @IsNotEmpty()
  character!: string;

  @IsNumber()
  @IsNotEmpty()
  price!: number;

  @IsString()
  @IsNotEmpty()
  color!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsArray()
  @IsNotEmpty()
  images!: string[];
}
