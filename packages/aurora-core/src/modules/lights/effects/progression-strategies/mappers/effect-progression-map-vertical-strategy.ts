import EffectProgressionMapStrategy from './effect-progression-map-strategy';
import LightsGroupFixture from '../../../entities/lights-group-fixture';

export default class EffectProgressionMapVerticalStrategy extends EffectProgressionMapStrategy {
  getNrFixtures(): number {
    return this.lightsGroup.gridSizeY * this.multiplier;
  }

  getProgression(progression: number, fixture: LightsGroupFixture): number {
    const relativePosition = fixture.positionY / this.getNrFixtures();
    return (relativePosition + progression) % 1;
  }
}
