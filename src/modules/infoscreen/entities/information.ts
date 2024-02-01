import {
  Column, Entity,
} from 'typeorm';
import BaseEntity from './base-entity';
import { RoomStatus } from './enums/roomStatus';
import { AlcoholTime } from './enums/alcoholTime';

@Entity()
export default class Information extends BaseEntity {
  @Column({
    type: process.env.TYPEORM_CONNECTION === 'sqlite' ? 'varchar' : 'enum',
    enum: RoomStatus,
    default: RoomStatus.CLOSED,
  })
  public roomStatus!: RoomStatus;

  @Column({
    type: process.env.TYPEORM_CONNECTION === 'sqlite' ? 'varchar' : 'enum',
    enum: AlcoholTime,
    default: AlcoholTime.NORMAL,
  })
  public alcoholTime!: AlcoholTime;

  @Column()
  public firstResponsible!: string;

  @Column({ nullable: true })
  public secondResponsible?: string;

  @Column({ nullable: true })
  public firstERO?: string;

  @Column({ nullable: true })
  public secondERO?: string;
}
