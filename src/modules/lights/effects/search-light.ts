import LightsEffect, { LightsEffectBuilder } from './lights-effect';
import { LightsGroup, LightsMovingHeadRgb, LightsMovingHeadWheel } from '../entities';

/**
 * @property radiusFactor Radius of the search light
 * @property cycleTime Time for the moving head to go around (in milliseconds)
 * @property offsetFactor What phase the lights should move apart from each other. 0 for synchronous
 */
export interface SearchLightProps {
  radiusFactor?: number;
  cycleTime?: number;
  offsetFactor?: number;
}

export default class SearchLight extends LightsEffect {
  private cycleStartTick: Date = new Date();

  private radiusFactor = 1;

  private cycleTime = 4000;

  private offsetFactor = 0.5 * Math.PI;

  /**
   * @param lightsGroup
   * @param props
   */
  constructor(
    lightsGroup: LightsGroup,
    props: SearchLightProps,
  ) {
    super(lightsGroup);
    if (props.radiusFactor !== undefined) this.radiusFactor = props.radiusFactor;
    if (props.cycleTime !== undefined) this.cycleTime = props.cycleTime;
    if (props.offsetFactor !== undefined) this.offsetFactor = props.offsetFactor;
  }

  public static build(props: SearchLightProps): LightsEffectBuilder {
    return (lightsGroup) => new SearchLight(lightsGroup, props);
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
