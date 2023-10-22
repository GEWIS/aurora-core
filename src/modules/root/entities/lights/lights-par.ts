import { Column, Entity } from 'typeorm';
import LightsFixture from './lights-fixture';
import Colors from './colors';

@Entity()
export default class LightsPar extends LightsFixture {
  @Column(() => Colors)
  public color: Colors;
}
