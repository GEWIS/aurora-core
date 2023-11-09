import { Column } from 'typeorm';
import LightsFixture from './lights-fixture';
import Movement from './movement';

export default abstract class LightsMovingHead extends LightsFixture {
  @Column(() => Movement)
  public movement: Movement;
}
