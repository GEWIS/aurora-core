import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
// eslint-disable-next-line import/no-cycle -- cross reference
import LightsGroupPars from '../lights-group-pars';
// eslint-disable-next-line import/no-cycle -- cross reference
import LightsSceneFixture from './lights-scene-fixture';

@Entity()
export default class LightsScenePars extends LightsSceneFixture {
  @PrimaryColumn()
  public groupParId: number;

  @ManyToOne(() => LightsGroupPars)
  @JoinColumn({ name: 'groupParId' })
  public par: LightsGroupPars;
}
