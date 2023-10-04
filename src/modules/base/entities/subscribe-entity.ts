import BaseEntity from "./base-entity";
import {Column} from "typeorm";

export default class SubscribeEntity extends BaseEntity {
  static entities = new Set<typeof SubscribeEntity>();

  @Column()
  public currentHandler: string;

  @Column()
  public name: string;
}
