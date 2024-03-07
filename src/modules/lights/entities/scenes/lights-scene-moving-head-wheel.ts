import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
// eslint-disable-next-line import/no-cycle -- cross reference
import LightsSceneFixture from './lights-scene-fixture';
// eslint-disable-next-line import/no-cycle -- cross reference
import LightsGroupMovingHeadWheels from '../lights-group-moving-head-wheels';

@Entity()
export default class LightsSceneMovingHeadWheel extends LightsSceneFixture {
  @PrimaryColumn()
  public groupMovingHeadWheelId: number;

  @ManyToOne(() => LightsGroupMovingHeadWheels)
  @JoinColumn({ name: 'groupMovingHeadWheelId' })
  public movingHeadWheel: LightsGroupMovingHeadWheels;
}
