import LightsEffect, { LightsEffectBuilder } from './lights-effect';
import { LightsGroup, LightsMovingHeadRgb, LightsMovingHeadWheel } from '../entities';

export default class SearchLightEffect extends LightsEffect {
  private cycleStartTick: Date = new Date();

  /**
   * @param lightsGroup
   * @param radiusFactor Radius of the search light
   * @param cycleTime Time for the moving head to go around (in milliseconds)
   * @param offsetFactor What phase the lights should move apart from each other. 0 for synchronous
   */
  constructor(
    lightsGroup: LightsGroup,
    private radiusFactor = 1,
    private cycleTime = 4000,
    private offsetFactor = 0.5 * Math.PI,
  ) {
    super(lightsGroup);
  }

  public static build(
    radiusFactor?: number,
    cycleTime?: number,
    offsetFactor?: number,
  ): LightsEffectBuilder {
    return (lightsGroup) => new SearchLightEffect(
      lightsGroup,
      radiusFactor,
      cycleTime,
      offsetFactor,
    );
  }

  beat(): void {
  }

  private getProgression(currentTick: Date) {
    return Math.min(1, (currentTick.getTime() - this.cycleStartTick.getTime()) / this.cycleTime);
  }

  private setPosition(
    movingHead: LightsMovingHeadWheel | LightsMovingHeadRgb,
    progression: number,
    offset: number = 0,
  ) {
    movingHead.setCurrentValues({
      panChannel: Math.cos(progression * 2 * Math.PI + offset) * 42 + 42,
      tiltChannel: Math.sin(progression * 2 * Math.PI + offset) * 64 * this.radiusFactor + 128,
      masterDimChannel: 255,
    });
  }

  tick(): LightsGroup {
    const currentTick = new Date();
    const progression = this.getProgression(currentTick);
    if (progression >= 1) {
      this.cycleStartTick = currentTick;
    }

    this.lightsGroup.movingHeadWheels.forEach((m, i) => {
      this.setPosition(m.fixture, progression, i * this.offsetFactor);
    });

    this.lightsGroup.movingHeadRgbs.forEach((m, i) => {
      const index = i + this.lightsGroup.movingHeadWheels.length;
      this.setPosition(m.fixture, progression, index * this.offsetFactor);
    });

    return this.lightsGroup;
  }
}
