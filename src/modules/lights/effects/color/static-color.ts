import LightsEffect, { BaseLightsEffectCreateParams, LightsEffectBuilder } from '../lights-effect';

import { LightsGroup } from '../../entities';
import { RgbColor } from '../../color-definitions';
import { TrackPropertiesEvent } from '../../../events/music-emitter-events';

export interface StaticColorProps {
  /**
   * Color that should be shown
   */
  color: RgbColor;

  /**
   * Name of the gobo that should be used
   */
  gobo?: string;

  /**
   * Beat
   */
  beatToggle?: boolean;

  /**
   * Brightness
   * @isInt
   * @minimum 0
   * @maximum 1
   */
  relativeBrightness?: number;
}

export type StaticColorCreateParams = BaseLightsEffectCreateParams & {
  type: 'StaticColor';
  props: StaticColorProps;
};

export default class StaticColor extends LightsEffect<StaticColorProps> {
  private ping = 0;

  constructor(lightsGroup: LightsGroup, props: StaticColorProps, features?: TrackPropertiesEvent) {
    super(lightsGroup, features);
    this.props = props;

    this.lightsGroup.fixtures.forEach((f) => {
      f.fixture.setColor(this.props.color);
      if (!this.props.beatToggle) {
        f.fixture.setMasterDimmer(Math.round((this.props.relativeBrightness ?? 1) * 255));
      }
    });
    this.lightsGroup.movingHeadWheels.forEach((f) => {
      if (this.props.gobo) f.fixture.setGobo(this.props.gobo);
    });

    this.beat();
  }

  public static build(props: StaticColorProps): LightsEffectBuilder<StaticColorProps, StaticColor> {
    return (lightsGroup, features) => new StaticColor(lightsGroup, props, features);
  }

  beat(): void {
    if (!this.props.beatToggle) return;

    this.lightsGroup.fixtures.forEach((f, i) => {
      if ((this.ping + 1) % 2 === i) {
        f.fixture.setMasterDimmer(Math.round((this.props.relativeBrightness ?? 1) * 255));
      } else {
        f.fixture.setMasterDimmer(0);
      }
    });

    this.ping = (this.ping + 1) % 2;
  }

  destroy(): void {}

  tick(): LightsGroup {
    return this.lightsGroup;
  }
}
