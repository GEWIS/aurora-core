import {Column, Entity, JoinColumn, ManyToOne, OneToMany} from "typeorm";
import LightsController from "../lights-controller";
import BaseEntity from "../base-entity";
import LightsGroupPars from "./lights-group-pars";
import LightsGroupMovingHeadWheels from "./lights-group-moving-head-wheels";
import LightsGroupMovingHeadRgbs from "./lights-group-moving-head-rgbs";

@Entity()
export default class LightsGroup extends BaseEntity {
  @Column()
  public name: string;

  @ManyToOne(() => LightsController)
  @JoinColumn()
  public controller: LightsController;

  @OneToMany(() => LightsGroupPars, (pars) => pars.lightsGroup)
  public pars: LightsGroupPars[];

  @OneToMany(() => LightsGroupMovingHeadWheels, (pars) => pars.lightsGroup)
  public movingHeadWheels: LightsGroupMovingHeadWheels[];

  @OneToMany(() => LightsGroupMovingHeadRgbs, (pars) => pars.lightsGroup)
  public movingHeadRgbs: LightsGroupMovingHeadRgbs[];
}
