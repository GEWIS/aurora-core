import {
  Entity, JoinColumn, ManyToOne, PrimaryColumn,
} from 'typeorm';
import LightsSceneFixture from './lights-scene-fixture';
import LightsGroupMovingHeadWheels from '../lights-group-moving-head-wheels';

@Entity()
export default class LightsSceneMovingHeadWheel extends LightsSceneFixture {
  @PrimaryColumn()
  public groupMovingHeadWheelId: number;

  @ManyToOne(() => LightsGroupMovingHeadWheels)
  @JoinColumn({ name: 'groupMovingHeadWheelId' })
  public movingHeadWheel: LightsGroupMovingHeadWheels;
}
