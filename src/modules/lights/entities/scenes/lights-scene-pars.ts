import {
  Entity, JoinColumn, ManyToOne, PrimaryColumn,
} from 'typeorm';
import LightsGroupPars from '../lights-group-pars';
import LightsSceneFixture from './lights-scene-fixture';

@Entity()
export default class LightsScenePars extends LightsSceneFixture {
  @PrimaryColumn()
  public groupParId: number;

  @ManyToOne(() => LightsGroupPars)
  @JoinColumn({ name: 'groupParId' })
  public par: LightsGroupPars;
}
