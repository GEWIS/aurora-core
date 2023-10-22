import {
  Entity, JoinColumn, ManyToOne, OneToMany,
} from 'typeorm';
// eslint-disable-next-line import/no-cycle
import LightsController from '../lights-controller';
// eslint-disable-next-line import/no-cycle
import LightsGroupPars from './lights-group-pars';
// eslint-disable-next-line import/no-cycle
import LightsGroupMovingHeadWheels from './lights-group-moving-head-wheels';
// eslint-disable-next-line import/no-cycle
import LightsGroupMovingHeadRgbs from './lights-group-moving-head-rgbs';
import SubscribeEntity from '../subscribe-entity';

@Entity()
export default class LightsGroup extends SubscribeEntity {
  @ManyToOne(() => LightsController)
  @JoinColumn()
  public controller: LightsController;

  @OneToMany(() => LightsGroupPars, (pars) => pars.group)
  public pars: LightsGroupPars[];

  @OneToMany(() => LightsGroupMovingHeadWheels, (pars) => pars.group)
  public movingHeadWheels: LightsGroupMovingHeadWheels[];

  @OneToMany(() => LightsGroupMovingHeadRgbs, (pars) => pars.group)
  public movingHeadRgbs: LightsGroupMovingHeadRgbs[];
}
