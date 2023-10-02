import BaseEntity from "../base-entity";
import {Column} from "typeorm";

export default class LightsFixture extends BaseEntity {
  @Column()
  public name: string;

  @Column({ type: "tinyint", unsigned: true })
  public masterDimChannel: number;

  @Column({ type: "tinyint", unsigned: true })
  public strobeChannel: number;
}
