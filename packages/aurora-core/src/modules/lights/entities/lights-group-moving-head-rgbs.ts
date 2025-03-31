import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@gewis/aurora-core-util';
// eslint-disable-next-line import/no-cycle
import LightsGroup from './lights-group';
import LightsMovingHeadRgb from './lights-moving-head-rgb';
import LightsGroupFixture from './lights-group-fixture';

@Entity()
export default class LightsGroupMovingHeadRgbs extends LightsGroupFixture {
  @ManyToOne(() => LightsGroup)
  @JoinColumn()
  public group: LightsGroup;

  @ManyToOne(() => LightsMovingHeadRgb, { eager: true })
  @JoinColumn()
  public fixture: LightsMovingHeadRgb;

  public toDmx(): number[] {
    return this.fixture.toDmx(this.masterRelativeBrightness);
  }
}
