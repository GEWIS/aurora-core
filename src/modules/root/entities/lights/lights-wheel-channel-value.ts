import { Column, Entity, ManyToOne } from 'typeorm';
import LightsMovingHeadWheel from './lights-moving-head-wheel';
import BaseEntity from '../base-entity';

export enum ColorWheelColors {
  RED = 'red',
  GREEN = 'green',
  BLUE = 'blue',
  YELLOW = 'yellow',
  LIGHTBLUE = 'lightBlue',
  ORANGE = 'orange',
  ROSERED = 'roseRed',
}

@Entity()
export default class LightsWheelChannelValue<T> extends BaseEntity {
  @ManyToOne(() => LightsMovingHeadWheel)
  public movingHead: LightsMovingHeadWheel;

  @Column({ type: 'varchar' })
  public channel: keyof LightsMovingHeadWheel;

  @Column({ type: 'varchar' })
  public name: T;

  @Column({ type: 'smallint', unsigned: true })
  public value: number;
}
