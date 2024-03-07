import { Column, Entity, OneToMany } from 'typeorm';
import BaseEntity from '../../../root/entities/base-entity';
// eslint-disable-next-line import/no-cycle -- cross reference
import LightsScenePars from './lights-scene-pars';
// eslint-disable-next-line import/no-cycle -- cross reference
import LightsSceneMovingHeadRgb from './lights-scene-moving-head-rgb';
import LightsSceneMovingHeadWheel from './lights-scene-moving-head-wheel';

@Entity()
export default class LightsScene extends BaseEntity {
  @Column()
  public name: string;

  @OneToMany(() => LightsScenePars, (s) => s.scene, { cascade: true })
  public pars: LightsScenePars[];

  @OneToMany(() => LightsSceneMovingHeadRgb, (s) => s.scene, { cascade: true })
  public movingHeadRgbs: LightsSceneMovingHeadRgb[];

  @OneToMany(() => LightsSceneMovingHeadWheel, (s) => s.scene, { cascade: true })
  public movingHeadWheels: LightsSceneMovingHeadWheel[];
}
