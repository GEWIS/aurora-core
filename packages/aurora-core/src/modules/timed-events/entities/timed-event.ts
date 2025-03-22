import BaseEntity from '../../root/entities/base-entity';
import { Column, Entity } from 'typeorm';
import EventSpec from '../event-spec';

@Entity()
export default class TimedEvent extends BaseEntity {
  @Column()
  public cronExpression: string;

  @Column({
    type: 'varchar',
    transformer: {
      from(value: string): EventSpec {
        return JSON.parse(value);
      },
      to(value: EventSpec): string {
        return JSON.stringify(value);
      },
    },
  })
  public eventSpec: EventSpec;

  /**
   * Whether the next time this should fire, it should be skipped instead
   */
  @Column({ default: false })
  public skipNext: boolean;
}
