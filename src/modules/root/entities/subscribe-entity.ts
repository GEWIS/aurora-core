import { Column } from 'typeorm';
import BaseEntity from './base-entity';

export default class SubscribeEntity extends BaseEntity {
  @Column({ nullable: true })
  public currentHandler?: string;

  @Column()
  public name: string;

  /**
   * ID of the socket connection if present.
   * Required to send events specifically and only to this entity
   */
  @Column({ nullable: true })
  public socketId?: string;
}
