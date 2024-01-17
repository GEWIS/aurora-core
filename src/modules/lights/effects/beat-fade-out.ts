import LightsEffect, { LightsEffectBuilder } from './lights-effect';
import { BeatEvent, TrackPropertiesEvent } from '../../events/music-emitter-events';
import { LightsGroup } from '../entities';
import { RgbColorSpecification } from '../color-definitions';

/**
 * @property colors One or more colors that should be shown
 * @property enableFade Whether the lights should be turned off using a fade effect
 * on each beat
 * @property addBlacks If a "black" color should be added
 */
export interface BeatFadeOutProps {
  colors: RgbColorSpecification[],
  enableFade?: boolean;
  addBlacks?: boolean;
}

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

  tick(): LightsGroup {
    const { colors, enableFade, addBlacks } = this.props;

    const beatProgression = enableFade ? Math.max(
      1 - ((new Date().getTime() - this.lastBeat) / this.beatLength),
      0,
    ) : 1;

    const nrColors = colors.length + (addBlacks ? 1 : 0);
    this.lightsGroup.pars.forEach((p, i) => {
      const index = (i + this.phase) % nrColors;
      if (index === colors.length) {
        p.fixture.setMasterDimmer(0);
        return;
      }
      const color = colors[index];
      p.fixture.setMasterDimmer(Math.round(255 * beatProgression));
      p.fixture.setColor(color.definition);
    });

    this.lightsGroup.movingHeadWheels.forEach((m) => m.fixture.blackout());
    this.lightsGroup.movingHeadRgbs.forEach((m) => m.fixture.blackout());

    return this.lightsGroup;
  }
}
