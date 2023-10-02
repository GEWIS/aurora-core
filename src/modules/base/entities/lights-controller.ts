import {BaseEntity, Column, Entity, OneToMany} from "typeorm";
import {LightsGroup} from "./lights";

@Entity()
export default class LightsController extends BaseEntity {
  @Column()
  public name: string;

  @OneToMany(() => LightsGroup, (group) => group.controller)
  public lightsGroups: LightsGroup[];
}
