import { AfterLoad, Column } from 'typeorm';
import BaseEntity from '../../root/entities/base-entity';

export interface LightsFixtureCurrentValues {
  masterDimChannel: number,
  strobeChannel: number,
}

export default class LightsFixture extends BaseEntity {
  @Column()
  public name: string;

  @Column({ type: 'tinyint', unsigned: true })
  public masterDimChannel: number;

  @Column({ type: 'tinyint', unsigned: true })
  public strobeChannel: number;

  public valuesUpdatedAt: Date;

  @AfterLoad()
  afterLoad() {
    this.valuesUpdatedAt = new Date();
  }
}
