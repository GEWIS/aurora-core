import BaseEntity from '../../root/entities/base-entity';
import { Column } from 'typeorm';

export default abstract class LightsGroupFixture extends BaseEntity {
  @Column({ type: 'real', unsigned: true, nullable: false })
  public positionX: number;

  @Column({ type: 'real', unsigned: true, nullable: false, default: 0 })
  public positionY: number;

  @Column({ type: 'smallint', unsigned: true })
  public firstChannel: number;

  public getActualChannel(relativeChannel: number) {
    return relativeChannel + this.firstChannel - 1;
  }
}
