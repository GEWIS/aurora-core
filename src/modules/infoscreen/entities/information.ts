import {
  Column, Entity,
} from 'typeorm';
import BaseEntity from './base-entity';
import { RoomStatus } from './enums/roomStatus';
import { AlcoholTime } from './enums/alcoholTime';

@Entity()
export default class Information extends BaseEntity {
  @Column({
    type: 'varchar',
    enum: RoomStatus,
    default: RoomStatus.CLOSED,
  })
  public roomStatus!: string;

  @Column({
    type: 'varchar',
    enum: AlcoholTime,
    default: AlcoholTime.NORMAL,
  })
  public alcoholTime!: string;

  @Column()
  public firstResponsible!: string;

  @Column({ nullable: true })
  public secondResponsible?: string;

  @Column({ nullable: true })
  public firstERO?: string;

  @Column({ nullable: true })
  public secondERO?: string;
}
