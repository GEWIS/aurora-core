import {Entity, JoinColumn, ManyToOne, OneToMany} from "typeorm";
import LightsController from "../lights-controller";
import LightsGroupPars from "./lights-group-pars";
import LightsGroupMovingHeadWheels from "./lights-group-moving-head-wheels";
import LightsGroupMovingHeadRgbs from "./lights-group-moving-head-rgbs";
import SubscribeEntity from "../subscribe-entity";

@Entity()
export default class LightsGroup extends SubscribeEntity {
  // Register child entity with parent
  static dummy = SubscribeEntity.entities.add(LightsGroup);

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
