import { Column, Entity } from 'typeorm';
import LightsFixture from './lights-fixture';
import Colors from './colors';

@Entity()
export default class LightsPar extends LightsFixture {
  @Column(() => Colors)
  public color: Colors;

  @Column({ type: 'tinyint', nullable: true, unsigned: true })
  public colorColdWhiteChannel?: number | null;

  @Column({ type: 'tinyint', nullable: true, unsigned: true })
  public colorWarmWhiteChannel?: number | null;

  @Column({ type: 'tinyint', nullable: true, unsigned: true })
  public colorAmberChannel?: number | null;

  @Column({ type: 'tinyint', nullable: true, unsigned: true })
  public colorUvChannel?: number | null;
}
