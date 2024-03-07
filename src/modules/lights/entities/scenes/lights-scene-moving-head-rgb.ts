import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
// eslint-disable-next-line import/no-cycle -- cross reference
import LightsSceneFixture from './lights-scene-fixture';
// eslint-disable-next-line import/no-cycle -- cross reference
import LightsGroupMovingHeadRgbs from '../lights-group-moving-head-rgbs';

@Entity()
export default class LightsSceneMovingHeadRgb extends LightsSceneFixture {
  @PrimaryColumn()
  public groupMovingHeadRgbId: number;

  @ManyToOne(() => LightsGroupMovingHeadRgbs)
  @JoinColumn({ name: 'groupMovingHeadRgbId' })
  public movingHeadRgb: LightsGroupMovingHeadRgbs;
}
