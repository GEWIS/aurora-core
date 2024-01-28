import LightsEffect, { BaseLightsEffectCreateParams, LightsEffectBuilder } from './lights-effect';

import { LightsGroup } from '../entities';
import { RgbColor } from '../color-definitions';
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

    this.lightsGroup.fixtures.forEach((f) => {
      f.fixture.setColor(this.props.color);
      f.fixture.setMasterDimmer(255);
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
