import {
  Column, Entity, JoinColumn, ManyToOne,
} from 'typeorm';
import BaseEntity from '../../root/entities/base-entity';
// eslint-disable-next-line import/no-cycle
import LightsGroup from './lights-group';
import LightsMovingHeadWheel from './lights-moving-head-wheel';

@Entity()
export default class LightsGroupMovingHeadWheels extends BaseEntity {
  @ManyToOne(() => LightsGroup)
  @JoinColumn()
  public group: LightsGroup;

  @ManyToOne(() => LightsMovingHeadWheel, { eager: true })
  @JoinColumn()
  public fixture: LightsMovingHeadWheel;

  @Column({ type: 'smallint', unsigned: true })
  public firstChannel: number;

  public getActualChannel(relativeChannel: number) {
    return relativeChannel + this.firstChannel - 1;
  }
}
