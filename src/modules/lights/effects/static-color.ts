import LightsEffect, { BaseLightsEffectCreateParams, LightsEffectBuilder } from './lights-effect';

import { LightsGroup } from '../entities';
import { RgbColor, rgbColorDefinitions } from '../color-definitions';
import { TrackPropertiesEvent } from '../../events/music-emitter-events';

export interface StaticColorProps {
  /**
   * Color that should be shown
   */
  color: RgbColor;
}

export type StaticColorCreateParams = BaseLightsEffectCreateParams & {
  type: 'StaticColor';
  props: StaticColorProps;
};

export default class StaticColor extends LightsEffect<StaticColorProps> {
  constructor(lightsGroup: LightsGroup, props: StaticColorProps, features?: TrackPropertiesEvent) {
    super(lightsGroup, features);
    this.props = props;

    const color = rgbColorDefinitions[this.props.color];
    this.lightsGroup.pars.forEach((p) => {
      p.fixture.setColor(color.definition);
      p.fixture.setMasterDimmer(255);
    });
  }

  public static build(props: StaticColorProps): LightsEffectBuilder<StaticColorProps, StaticColor> {
    return (lightsGroup, features) => new StaticColor(lightsGroup, props, features);
  }

  beat(): void {
  }

  destroy(): void {
  }

  tick(): LightsGroup {
    return this.lightsGroup;
  }
}
