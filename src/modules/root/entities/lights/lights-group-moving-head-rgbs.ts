import {
  Column, Entity, JoinColumn, ManyToOne,
} from 'typeorm';
import BaseEntity from '../base-entity';
// eslint-disable-next-line import/no-cycle
import LightsGroup from './lights-group';
import LightsMovingHeadRgb from './lights-moving-head-rgb';

@Entity()
export default class LightsGroupMovingHeadRgbs extends BaseEntity {
  @ManyToOne(() => LightsGroup)
  @JoinColumn()
  public group: LightsGroup;

  @ManyToOne(() => LightsMovingHeadRgb, { eager: true })
  @JoinColumn()
  public movingHead: LightsMovingHeadRgb;

  @Column({ type: 'smallint', unsigned: true })
  public firstChannel: number;

  public getActualChannel(relativeChannel: number) {
    return relativeChannel + this.firstChannel - 1;
  }
}
