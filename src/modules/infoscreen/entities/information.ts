import { Column, Entity } from 'typeorm';
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
    nullable: true,
  })
  public alcoholTime!: AlcoholTime | null;

  @Column({ type: 'text', nullable: true })
  public firstResponsible!: string | null;

  @Column({ type: 'text', nullable: true })
  public secondResponsible!: string | null;

  @Column({ type: 'text', nullable: true })
  public firstERO!: string | null;

  @Column({ type: 'text', nullable: true })
  public secondERO!: string | null;
}
