import LightsEffect, { BaseLightsEffectCreateParams, LightsEffectBuilder } from '../lights-effect';
import { BeatEvent, TrackPropertiesEvent } from '../../../events/music-emitter-events';
import {
  LightsGroup, LightsGroupMovingHeadRgbs, LightsGroupMovingHeadWheels, LightsGroupPars,
} from '../../entities';
import { RgbColor } from '../../color-definitions';

export interface BeatFadeOutProps {
  /**
   * One or more colors that should be shown
   */
  colors: RgbColor[],

  /**
   * Whether the lights should be turned off using a fade effect
   * on each beat
   */
  enableFade?: boolean;

  /**
   * If a "black" color should be added
   */
  addBlacks?: boolean;
}

export type BeatFadeOutCreateParams = BaseLightsEffectCreateParams & {
  type: 'BeatFadeOut';
  props: BeatFadeOutProps;
};

export default class BeatFadeOut extends LightsEffect<BeatFadeOutProps> {
  private phase = 0;

  private lastBeat = new Date().getTime(); // in ms since epoch;

  private beatLength: number = 1; // in ms;

  constructor(
    lightsGroup: LightsGroup,
    props: BeatFadeOutProps,
    features?: TrackPropertiesEvent,
  ) {
    super(lightsGroup, features);
    this.props = props;
  }

  /**
   * Create an constructor function that will create this effect with the given parameters
   * Used when you want to reference effects, but are not in the context of handlers.
   * on each beat
   * @param props
   */
  public static build(
    props: BeatFadeOutProps,
  ): LightsEffectBuilder<BeatFadeOutProps, BeatFadeOut> {
    return (
      lightsGroup: LightsGroup,
      features?: TrackPropertiesEvent,
    ) => new BeatFadeOut(lightsGroup, props, features);
  }

  destroy(): void {}

  beat(event: BeatEvent): void {
    this.lastBeat = new Date().getTime();
    this.beatLength = event.beat.duration * 1000;
    this.phase = (this.phase + 1) % (this.props.colors.length + (this.props.addBlacks ? 1 : 0));
  }

  getCurrentColor(i: number) {
    const { colors, addBlacks } = this.props;
    const nrColors = colors.length + (addBlacks ? 1 : 0);
    const index = (i + this.phase) % nrColors;
    if (index === colors.length) {
      return null;
    }
    return colors[index];
  }

  applyColorToFixture(
    p: LightsGroupPars | LightsGroupMovingHeadRgbs | LightsGroupMovingHeadWheels,
    i: number,
  ) {
    const { enableFade } = this.props;
    const beatProgression = enableFade ? Math.max(
      1 - ((new Date().getTime() - this.lastBeat) / this.beatLength),
      0,
    ) : 1;

    const color = this.getCurrentColor(i);
    if (color == null) {
      p.fixture.setMasterDimmer(0);
    } else {
      p.fixture.setMasterDimmer(Math.round(255 * beatProgression));
      p.fixture.setColor(color);
    }
  }

  tick(): LightsGroup {
    this.lightsGroup.pars.forEach(this.applyColorToFixture);
    this.lightsGroup.movingHeadRgbs.forEach(this.applyColorToFixture);

    return this.lightsGroup;
  }
}
