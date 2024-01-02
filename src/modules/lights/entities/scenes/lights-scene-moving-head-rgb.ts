import {
  Entity, JoinColumn, ManyToOne, PrimaryColumn,
} from 'typeorm';
import LightsSceneFixture from './lights-scene-fixture';
import LightsGroupMovingHeadRgbs from '../lights-group-moving-head-rgbs';

@Entity()
export default class LightsSceneMovingHeadRgb extends LightsSceneFixture {
  @PrimaryColumn()
  public groupMovingHeadRgbId: number;

  @ManyToOne(() => LightsGroupMovingHeadRgbs)
  @JoinColumn({ name: 'groupMovingHeadRgbId' })
  public movingHeadRgb: LightsGroupMovingHeadRgbs;
}
