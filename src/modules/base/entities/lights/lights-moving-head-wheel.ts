import LightsMovingHead from "./lights-moving-head";
import {Column, Entity} from "typeorm";

@Entity()
export default class LightsMovingHeadWheel extends LightsMovingHead {
  @Column({ type: "tinyint", unsigned: true })
  public colorWheelChannel: number;

  @Column({ type: "tinyint", unsigned: true })
  public goboWheelChannel: number;

  @Column({ type: "tinyint", nullable: true, unsigned: true })
  public goboRotateChannel: number | null;
}
