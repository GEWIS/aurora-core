import {
  Column, Entity, JoinColumn, ManyToOne,
} from 'typeorm';
import BaseEntity from '../base-entity';
// eslint-disable-next-line import/no-cycle
import LightsGroup from './lights-group';
import LightsMovingHeadWheel from './lights-moving-head-wheel';

@Entity()
export default class LightsGroupMovingHeadWheels extends BaseEntity {
  @ManyToOne(() => LightsGroup)
  @JoinColumn()
  public lightsGroup: LightsGroup;

  @ManyToOne(() => LightsMovingHeadWheel)
  @JoinColumn()
  public movingHead: LightsMovingHeadWheel;

  @Column({ type: 'smallint', unsigned: true })
  public firstChannel: number;
}
