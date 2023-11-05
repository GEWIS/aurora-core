import {
  Entity, JoinColumn, ManyToOne, OneToMany,
} from 'typeorm';
// eslint-disable-next-line import/no-cycle
import { LightsController } from '../../root/entities';
// eslint-disable-next-line import/no-cycle
import LightsGroupPars from './lights-group-pars';
// eslint-disable-next-line import/no-cycle
import LightsGroupMovingHeadWheels from './lights-group-moving-head-wheels';
// eslint-disable-next-line import/no-cycle
import LightsGroupMovingHeadRgbs from './lights-group-moving-head-rgbs';
import SubscribeEntity from '../../root/entities/subscribe-entity';

@Entity()
export default class LightsGroup extends SubscribeEntity {
  @ManyToOne(() => LightsController, { eager: true })
  @JoinColumn()
  public controller: LightsController;

  @OneToMany(() => LightsGroupPars, (pars) => pars.group, { eager: true })
  public pars: LightsGroupPars[];

  @OneToMany(() => LightsGroupMovingHeadWheels, (pars) => pars.group, { eager: true })
  public movingHeadWheels: LightsGroupMovingHeadWheels[];

  @OneToMany(() => LightsGroupMovingHeadRgbs, (pars) => pars.group, { eager: true })
  public movingHeadRgbs: LightsGroupMovingHeadRgbs[];

  public blackout() {
    this.pars.forEach((par) => par.fixture.blackout());
    // this.movingHeadWheels.forEach((par) => par.movingHead.blackout());
    // this.movingHeadRgbs.forEach((par) => par.movingHead.blackout());
  }
}
