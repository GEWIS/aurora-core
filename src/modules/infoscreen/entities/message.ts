import {
  Column, Entity,
} from 'typeorm';
import BaseEntity from './base-entity';

@Entity()
export default class Message extends BaseEntity {
  @Column('text')
  public user!: string;

  @Column('text')
  public message!: string;
}
