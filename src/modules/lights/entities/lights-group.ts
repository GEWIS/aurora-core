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

  public get fixtures(): (LightsGroupPars
  | LightsGroupMovingHeadWheels | LightsGroupMovingHeadRgbs)[] {
    return [...this.pars, ...this.movingHeadWheels, ...this.movingHeadRgbs];
  }

  public blackout() {
    this.pars.forEach((par) => par.fixture.blackout());
    this.movingHeadWheels.forEach((par) => par.fixture.blackout());
    this.movingHeadRgbs.forEach((par) => par.fixture.blackout());
  }

  /**
   * Enable the strobe on all fixtures in this group
   */
  public enableStrobe(milliseconds?: number) {
    this.pars.forEach((par) => par.fixture.enableStrobe(milliseconds));
    this.movingHeadWheels.forEach((par) => par.fixture.enableStrobe(milliseconds));
    this.movingHeadRgbs.forEach((par) => par.fixture.enableStrobe(milliseconds));
  }

  /**
   * Disable the strobe for all fixtures in this group (if strobe is enabled)
   */
  public disableStrobe() {
    this.pars.forEach((par) => par.fixture.disableStrobe());
    this.movingHeadWheels.forEach((par) => par.fixture.disableStrobe());
    this.movingHeadRgbs.forEach((par) => par.fixture.disableStrobe());
  }
}
