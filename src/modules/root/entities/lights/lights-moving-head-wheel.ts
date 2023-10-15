import { Column, Entity } from 'typeorm';
import LightsMovingHead from './lights-moving-head';

@Entity()
export default class LightsMovingHeadWheel extends LightsMovingHead {
  @Column({ type: 'tinyint', unsigned: true })
  public colorWheelChannel: number;

  @Column({ type: 'tinyint', unsigned: true })
  public goboWheelChannel: number;

  @Column({ type: 'tinyint', nullable: true, unsigned: true })
  public goboRotateChannel: number | null;
}
