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
  // A copy should be kept in the database, because entities are only
  // in memory when they are registered to a handler.
  @Column({ nullable: true })
  public socketId?: string;
}
