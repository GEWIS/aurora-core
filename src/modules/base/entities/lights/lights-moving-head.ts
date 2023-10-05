import { Column } from 'typeorm';
import LightsFixture from './lights-fixture';

export default class LightsMovingHead extends LightsFixture {
  @Column({ type: 'tinyint', unsigned: true })
  public panChannel: number;

  @Column({ type: 'tinyint', nullable: true, unsigned: true })
  public finePanChannel: number | null;

  @Column({ type: 'tinyint', unsigned: true })
  public tiltChannel: number;

  @Column({ type: 'tinyint', nullable: true, unsigned: true })
  public fineTiltChannel: number | null;

  @Column({ type: 'tinyint', nullable: true, unsigned: true })
  public movingSpeedChannel: number | null;
}
