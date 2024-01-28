import { Column, Entity, ManyToOne } from 'typeorm';
import LightsMovingHeadWheel from './lights-moving-head-wheel';
import BaseEntity from '../../root/entities/base-entity';

@Entity()
export default class LightsWheelChannelValue<T> extends BaseEntity {
  @ManyToOne(() => LightsMovingHeadWheel)
  public movingHead: LightsMovingHeadWheel;

  @Column({ type: 'varchar' })
  public name: T;

  @Column({ type: 'smallint', unsigned: true })
  public value: number;
}
