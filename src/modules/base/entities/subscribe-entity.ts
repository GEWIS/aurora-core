import { Column } from 'typeorm';
import BaseEntity from './base-entity';

export default class SubscribeEntity extends BaseEntity {
  @Column({ nullable: true })
  public currentHandler?: string;

  @Column()
  public name: string;
}
