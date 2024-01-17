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

const DEFAULT_RADIUS_FACTOR = 1;
const DEFAULT_CYCLE_TIME = 4000;
const DEFAULT_OFFSET_FACTOR = 0.5 * Math.PI;

export default class SearchLight extends LightsEffect {
  private cycleStartTick: Date = new Date();

  private props: SearchLightProps;

  /**
   * @param lightsGroup
   * @param props
   */
  constructor(
    lightsGroup: LightsGroup,
    props: SearchLightProps,
  ) {
    super(lightsGroup);
    this.props = props;
  }

  public static build(props: SearchLightProps = {}): LightsEffectBuilder {
    return (lightsGroup) => new SearchLight(lightsGroup, props);
  }

  destroy(): void {}

  beat(): void {}

  private getProgression(currentTick: Date) {
    const cycleTime = this.props.cycleTime ?? DEFAULT_CYCLE_TIME;
    return Math.min(1, (currentTick.getTime() - this.cycleStartTick.getTime()) / cycleTime);
  }

  private setPosition(
    movingHead: LightsMovingHeadWheel | LightsMovingHeadRgb,
    progression: number,
    offset: number = 0,
  ) {
    const radiusFactor = this.props.radiusFactor ?? DEFAULT_RADIUS_FACTOR;

    movingHead.setCurrentValues({
      panChannel: Math.cos(progression * 2 * Math.PI + offset) * 42 + 42,
      tiltChannel: Math.sin(progression * 2 * Math.PI + offset) * 64 * radiusFactor + 128,
      masterDimChannel: 255,
    });
  }

  tick(): LightsGroup {
    const currentTick = new Date();
    const progression = this.getProgression(currentTick);
    const offsetFactor = this.props.offsetFactor ?? DEFAULT_OFFSET_FACTOR;
    if (progression >= 1) {
      this.cycleStartTick = currentTick;
    }

    this.lightsGroup.movingHeadWheels.forEach((m, i) => {
      this.setPosition(m.fixture, progression, i * offsetFactor);
    });

    this.lightsGroup.movingHeadRgbs.forEach((m, i) => {
      const index = i + this.lightsGroup.movingHeadWheels.length;
      this.setPosition(m.fixture, progression, index * offsetFactor);
    });

    return this.lightsGroup;
  }
}
