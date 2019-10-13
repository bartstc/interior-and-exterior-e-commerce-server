import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { Collection } from '../../types/collection.type';
import { Type } from '../../types/type.type';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar', { length: 100 })
  name!: string;

  @Column('varchar', { length: 100 })
  collection!: Collection;

  @Column('varchar', { length: 100 })
  type!: Type;

  @Column('varchar', { length: 100 })
  character!: string;

  @Column('decimal')
  price!: number;

  @Column('varchar', { length: 100 })
  color!: string;

  @Column('text')
  description!: string;

  @Column('text', { array: true })
  images!: string[];
}
