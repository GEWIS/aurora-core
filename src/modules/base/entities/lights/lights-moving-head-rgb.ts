import LightsMovingHead from "./lights-moving-head";
import {Column, Entity} from "typeorm";
import Colors from "./colors";

@Entity()
export default class LightsMovingHeadRgb extends LightsMovingHead {
  @Column(() => Colors)
  public color: Colors
}
