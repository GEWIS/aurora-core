import LightsEffect, { BaseLightsEffectCreateParams, LightsEffectBuilder } from '../lights-effect';
import { LightsGroup } from '../../entities';
import { TrackPropertiesEvent } from '../../../events/music-emitter-events';
import { ColorEffects } from './color-effects';

export interface StrobeProps {
  /**
   * Duration in milliseconds
   * @isInt
   * @minimum 0
   */
  durationMs?: number;
}

export type StrobeCreateParams = BaseLightsEffectCreateParams & {
  type: ColorEffects.Strobe;
  props: StrobeProps;
};

export default class Strobe extends LightsEffect<StrobeProps> {
  constructor(lightsGroup: LightsGroup, props: StrobeProps, features?: TrackPropertiesEvent) {
    super(lightsGroup, undefined, features);
    this.props = props;

    this.lightsGroup.pars.forEach((p) => {
      p.fixture.enableStrobe(props.durationMs);
    });
    this.lightsGroup.movingHeadWheels.forEach((p) => {
      p.fixture.enableStrobe(props.durationMs);
    });
    this.lightsGroup.movingHeadRgbs.forEach((p) => {
      p.fixture.enableStrobe(props.durationMs);
    });
  }

  destroy(): void {
    this.lightsGroup.pars.forEach((p) => {
      p.fixture.disableStrobe();
    });
  }

  beat(): void {}

  tick(): LightsGroup {
    return this.lightsGroup;
  }

  public static build(props: StrobeProps): LightsEffectBuilder<StrobeProps, Strobe> {
    return (lightsGroup, features) => new Strobe(lightsGroup, props, features);
  }
}
